import "server-only";
import { prisma } from "@/lib/prisma";
import { RESTAURANT_MENU } from "@/lib/content/dining";

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
