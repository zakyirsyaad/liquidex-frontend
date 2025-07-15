export async function GET() {
  const res = await fetch(
    "https://api.github.com/repos/Linando/Liquidex_dashboard_data/contents/KOM_Dashboard_Data.json?ref=main",
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
    }
  );

  if (!res.ok) {
    return new Response("Gagal fetch dari GitHub", { status: 500 });
  }

  const data = await res.json();
  return Response.json(data);
}
