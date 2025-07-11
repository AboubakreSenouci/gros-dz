import { getUser } from '@/lib/queries';

export async function GET() {
  const user = await getUser();
  return Response.json(user);
}
