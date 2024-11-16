// Define the Menu type inline
interface Menu {
  id: number;       // Unique identifier for each menu item
  title: string;    // Title of the menu item
  path: string;     // Path or URL for the menu item
  newTab: boolean;  // Boolean indicating if the link opens in a new tab
}

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },

  {
    id: 2,
    title: "Exams",
    path: "/exams",
    newTab: false,
  },

  {
    id: 3,
    title: "Knowledge Hub",
    path: "/blogs",
    newTab: false,
  },
  {
    id: 4,
    title: "About Us",
    path: "/about",
    newTab: false,
  },

];
export default menuData;
