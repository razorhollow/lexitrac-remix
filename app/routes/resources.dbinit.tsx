import { json } from "@remix-run/node";

import { seed } from "prisma/seed";




export const action = async () => {
  await seed()
  // Process formData here
  // const result = await someDatabaseFunction(formData.get('field'));

  return json({ success: true }, 200)
};

