import "server-only";
import { prisma } from "@/lib/prisma";
import { MENU, RESTAURANT_MENU } from "@/lib/content/dining";
import { formatNaira } from "@/schemas/booking";

/** A dish tile in the restaurant menu grid. `image` is null until one is uploaded. */
export type MenuDishData = {
  key: string;
  name: string;
  image: string | null;
};

/**
 * Dishes for the dining page menu grid, read from `crm.MenuList` (available and
 * not archived), capped at `limit`. Rows that have a photo sort first, so newly
 * uploaded imagery surfaces into the grid without anyone reordering the CRM.
 * Falls back to the static list if the DB is unavailable or empty.
 */
export async function getMenuDishes(limit = 6): Promise<MenuDishData[]> {
  try {
    const rows = await prisma.menuList.findMany({
      where: { available: true, archived: false },
      orderBy: [{ image: { sort: "desc", nulls: "last" } }, { createdAt: "asc" }],
      take: limit,
      select: { id: true, name: true, image: true },
    });

    if (rows.length === 0) {
      return RESTAURANT_MENU.items.map((i) => ({ key: i.name, name: i.name, image: i.image }));
    }

    return rows.map((r) => ({ key: r.id, name: r.name, image: r.image }));
  } catch (err) {
    console.error("[getMenuDishes] falling back to static menu:", err);
    return RESTAURANT_MENU.items.map((i) => ({ key: i.name, name: i.name, image: i.image }));
  }
}

/** One row in the full dining menu listing. `image` is null until one is uploaded. */
export type MenuItemData = {
  key: string;
  name: string;
  desc: string;
  /** Pre-formatted for display, e.g. "₦12,000". */
  price: string;
  category: string;
  image: string | null;
};

/** Flatten the static menu so the fallback matches the DB-backed shape. */
function staticMenuItems(): MenuItemData[] {
  return MENU.flatMap((cat) =>
    cat.items.map((i) => ({
      key: `${cat.name}-${i.name}`,
      name: i.name,
      desc: i.desc,
      price: i.price,
      category: cat.name,
      image: i.image,
    })),
  );
}

/**
 * The full dining menu, read from `crm.MenuList` (available and not archived),
 * grouped by category order then name. Returned flat and complete — the listing
 * paginates client-side, so category headings stay correct across pages.
 * Falls back to the static menu if the DB is unavailable or empty.
 */
export async function getMenuItems(): Promise<MenuItemData[]> {
  try {
    const rows = await prisma.menuList.findMany({
      where: { available: true, archived: false },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: { select: { name: true } },
      },
    });

    if (rows.length === 0) return staticMenuItems();

    return rows.map((r) => ({
      key: r.id,
      name: r.name,
      desc: r.description,
      price: formatNaira(r.price),
      category: r.category.name,
      image: r.image,
    }));
  } catch (err) {
    console.error("[getMenuItems] falling back to static menu:", err);
    return staticMenuItems();
  }
}
