export const plans = [
  { slug: 'starter', name: 'Starter', price: 29, variantId: process.env.LEMON_STARTER_VARIANT_ID },
  { slug: 'pro', name: 'Pro', price: 49, variantId: process.env.LEMON_PRO_VARIANT_ID },
  { slug: 'enterprise', name: 'Enterprise', price: 99, variantId: process.env.LEMON_ENTERPRISE_VARIANT_ID }
] as const;

export async function createCheckout(variantId: string, email: string) {
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { email },
          custom_price: null
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LEMON_STORE_ID } },
          variant: { data: { type: 'variants', id: variantId } }
        }
      }
    })
  });

  if (!response.ok) throw new Error(`Lemon Squeezy checkout failed: ${response.status}`);
  const json = await response.json();
  return json.data.attributes.url as string;
}
