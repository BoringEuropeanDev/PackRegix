import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { country, format } = body // 'DE' | 'FR' | 'BE', format 'csv' | 'pdf'

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
    )

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    // Get user profile + packaging data
    const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
    const { data: packagingData } = await supabase
      .from('packaging')
      .select('*')
      .eq('user_id', user.id)
      .eq('country', country)

    if (!userData || !packagingData?.length) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 })
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${userData.company}_${country}_EPR_${timestamp}.${format === 'pdf' ? 'pdf' : 'csv'}`

    if (format === 'csv') {
      return generateCSV(userData, packagingData, country, filename)
    } else if (format === 'pdf') {
      return generatePDF(userData, packagingData, country, filename)
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (error) {
    console.error('Generate report error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

function generateCSV(userData: any, packagingData: any[], country: string, filename: string) {
  const rows = [
    ['PackRegix EPR Report', userData.company],
    ['Country', country],
    ['Generated', new Date().toISOString()],
    [''],
    ['Date', 'Material Type', 'Weight (kg)', 'Notes'],
  ]

  packagingData.forEach((item) => {
    rows.push([
      new Date(item.date).toLocaleDateString(),
      item.material_type || 'Unknown',
      item.weight_kg?.toString() || '0',
      item.notes || '',
    ])
  })

  const total = packagingData.reduce((sum: number, item: any) => sum + (item.weight_kg || 0), 0)
  rows.push([''])
  rows.push(['TOTAL', '', total.toFixed(2), 'kg'])

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

async function generatePDF(userData: any, packagingData: any[], country: string, filename: string) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792]) // Letter size
  const { height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = height - 50

  // Header
  page.drawText('PackRegix EPR Report', { x: 50, y, font: boldFont, size: 20, color: rgb(0.12, 0.1, 0.06) })
  y -= 30
  page.drawText(`Company: ${userData.company}`, { x: 50, y, font, size: 10 })
  y -= 15
  page.drawText(`Country: ${country}`, { x: 50, y, font, size: 10 })
  y -= 15
  page.drawText(`Generated: ${new Date().toISOString()}`, { x: 50, y, font, size: 10 })
  y -= 30

  // Table header
  page.drawText('Date', { x: 50, y, font: boldFont, size: 10 })
  page.drawText('Material', { x: 200, y, font: boldFont, size: 10 })
  page.drawText('Weight (kg)', { x: 350, y, font: boldFont, size: 10 })
  page.drawText('Notes', { x: 450, y, font: boldFont, size: 10 })
  y -= 20

  // Data rows
  packagingData.forEach((item) => {
    if (y < 50) {
      const newPage = pdfDoc.addPage([612, 792])
      y = height - 50
      page = newPage
    }

    page.drawText(new Date(item.date).toLocaleDateString(), { x: 50, y, font, size: 9 })
    page.drawText(item.material_type || 'Unknown', { x: 200, y, font, size: 9 })
    page.drawText((item.weight_kg || 0).toFixed(2), { x: 350, y, font, size: 9 })
    page.drawText(item.notes || '', { x: 450, y, font, size: 9 })
    y -= 15
  })

  // Total
  y -= 15
  const total = packagingData.reduce((sum: number, item: any) => sum + (item.weight_kg || 0), 0)
  page.drawText('TOTAL', { x: 50, y, font: boldFont, size: 10 })
  page.drawText(`${total.toFixed(2)} kg`, { x: 350, y, font: boldFont, size: 10 })

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
