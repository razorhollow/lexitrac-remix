import { redirect } from '@remix-run/node';
import { Form } from "@remix-run/react";

import { seed } from "prisma/seed";

import { Button } from "./ui/Button";



export const action = async () => {
  await seed()
  // Process formData here
  // const result = await someDatabaseFunction(formData.get('field'));

  return redirect('/dashboard');
};

export default function DBInitButton() {
  return (
    <Form
      method="POST"
    >
      <Button type='submit'>
        Initialize Database
      </Button>
    </Form>
  );
}