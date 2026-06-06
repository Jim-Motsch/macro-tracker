export async function GET(request: Request) {
//This is a Next.js API route - naming it GET means it handles GET requests to /api/food
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
//Extracts the query parameter from the URL so when you visit /api/food?query=chicken query = chicken
  if (!query) {
    return Response.json({ error: 'Query is required' }, { status: 400 })
  }
//If no query is provided return an error
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${process.env.USDA_API_KEY}&pageSize=10`
  )
//Calls the USDA API with your query and API key
  const data = await response.json()
  return Response.json(data)
//Takes the USDA response and sends it back to whoever called your API route
}