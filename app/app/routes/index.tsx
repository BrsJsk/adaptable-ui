import { redirect } from "react-router";

import { menu } from "../../src/config/menu";

// Send the bare root URL to the first page in the menu config.
export function loader() {
  return redirect(menu[0].path);
}

export default function Index() {
  return null;
}
