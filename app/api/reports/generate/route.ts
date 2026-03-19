import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

function buildReportData(entries: any[]): Record<string, { kg: number; units: number }> {
  const totals: Record<string, { kg: number; units: number }> = {}
  for (const entry of entries) {
    const mats = entry.materials || {}
    for (const [mat, vals] of Object.entries(mats) as any) {
      if (!totals[mat]) totals[mat] = { kg: 0, units: 0 }
      totals[mat].kg += vals.kg || 0
      totals[mat].units += vals.units || 0
    }
  }
  return totals
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { country, period, format } = body
    // period = '2026-Q1', format = 'csv' | 'pdf'

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: profile } = await supabase
      .from('users')
      .select('id, company, email')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    // Resolve quarter date range
    const [year, q] = period.split('-Q')
    const qStart = ['01-01', '04-01', '07-01', '10-01'][+q - 1]
    const qEnd   = ['03-31', '06-30', '09-30', '12-31'][+q - 1]

    const { data: entries, error: fetchError } = await supabase
      .from('packaging_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('country', country)
      .gte('period_start', `${year}-${qStart}`)
      .lte('period_end', `${year}-${qEnd}`)

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 })
    if (!entries?.length) return NextResponse.json({ error: 'No data for this period' }, { status: 404 })

    const reportData = buildReportData(entries)
    const totalKg = Object.values(reportData).reduce((s, v) => s + v.kg, 0)
    const filename = `${profile.company}_${country}_${period}.${format === 'pdf' ? 'pdf' : 'csv'}`

    // Save report record to DB
    await supabase.from('reports').insert({
      user_id: user.id,
      country,
      period,
      data: { ...reportData, totalKg },
    })

    if (format === 'csv') {
      return generateCSV(profile, country, period, reportData, totalKg, filename)
    } else if (format === 'pdf') {
      return await generatePDF(profile, country, period, reportData, totalKg, filename)
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (err) {
    console.error('Generate report error:', err)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

function generateCSV(
  profile: any,
  country: string,
  period: string,
  data: Record<string, { kg: number; units: number }>,
  totalKg: number,
  filename: string
) {
  const label =
    country === 'DE' ? 'LUCID (Germany)' :
    country === 'FR' ? 'CITEO (France)' :
    'Fost Plus (Belgium)'

  const rows: string[][] = [
    ['PackRegix EPR Compliance Report'],
    ['Company', profile.company],
    ['EPR Scheme', label],
    ['Period', period],
    ['Generated', new Date().toISOString()],
    [''],
    ['Material', 'Weight (kg)', 'Units'],
  ]

  for (const [mat, vals] of Object.entries(data)) {
    rows.push([
      mat.charAt(0).toUpperCase() + mat.slice(1),
      vals.kg.toFixed(2),
      vals.units ? vals.units.toString() : '—',
    ])
  }

  rows.push([''])
  rows.push(['TOTAL', totalKg.toFixed(2), ''])

  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

async function generatePDF(
  profile: any,
  country: string,
  period: string,
  data: Record<string, { kg: number; units: number }>,
  totalKg: number,
  filename: string
) {
  const label =
    country === 'DE' ? 'LUCID — Germany' :
    country === 'FR' ? 'CITEO — France' :
    'Fost Plus — Belgium'

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4
  const { height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const dark  = rgb(0.12, 0.10, 0.06)
  const muted = rgb(0.60, 0.54, 0.44)

  let y = height - 50

  // ── Header bar
  page.drawRectangle({
    x: 0, y: height - 80,
    width: 595, height: 80,
    color: rgb(0.12, 0.10, 0.06),
  })
  page.drawText('PackRegix', {
    x: 40, y: height - 52,
    font: bold, size: 18, color: rgb(0.96, 0.94, 0.91),
  })
  page.drawText('EPR Compliance Report', {
    x: 40, y: height - 68,
    font, size: 10, color: rgb(0.60, 0.54, 0.44),
  })

  y = height - 110

  // ── Company + meta
  page.drawText(profile.company, { x: 40, y, font: bold, size: 14, color: dark })
  y -= 20
  page.drawText(`${label}  ·  Period: ${period}`, { x: 40, y, font, size: 10, color: muted })
  y -= 14
  page.drawText(`Generated: ${new Date().toLocaleDateString('en-GB')}`, { x: 40, y, font, size: 9, color: muted })
  y -= 30

  // ── Divider
  page.drawLine({
    start: { x: 40, y }, end: { x: 555, y },
    thickness: 0.5, color: rgb(0.75, 0.68, 0.58),
  })
  y -= 22

  // ── Table header
  page.drawText('Material',    { x: 40,  y, font: bold, size: 10, color: dark })
  page.drawText('Weight (kg)', { x: 280, y, font: bold, size: 10, color: dark })
  page.drawText('Units',       { x: 430, y, font: bold, size: 10, color: dark })
  y -= 18

  // ── Table rows
  let rowBg = false
  for (const [mat, vals] of Object.entries(data)) {
    if (rowBg) {
      page.drawRectangle({
        x: 35, y: y - 4,
        width: 525, height: 18,
        color: rgb(0.95, 0.92, 0.88),
      })
    }
    page.drawText(mat.charAt(0).toUpperCase() + mat.slice(1), { x: 40,  y, font, size: 10, color: dark })
    page.drawText(vals.kg.toFixed(2),                         { x: 280, y, font, size: 10, color: dark })
    page.drawText(vals.units ? vals.units.toString() : '—',   { x: 430, y, font, size: 10, color: dark })
    y -= 20
    rowBg = !rowBg
  }

  // ── Total row
  y -= 8
  page.drawLine({
    start: { x: 40, y }, end: { x: 555, y },
    thickness: 0.5, color: rgb(0.75, 0.68, 0.58),
  })
  y -= 16
  page.drawText('TOTAL',                  { x: 40,  y, font: bold, size: 11, color: dark })
  page.drawText(`${totalKg.toFixed(2)} kg`, { x: 280, y, font: bold, size: 11, color: dark })

  // ── Footer
  page.drawText('Generated by PackRegix · packregix.com', {
    x: 40, y: 30,
    font, size: 8, color: muted,
  })

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
          },
  })
}
    
