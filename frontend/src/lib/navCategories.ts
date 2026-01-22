export interface SubCategory {
    name: string;
    href: string;
}

export interface CategoryGroup {
    name: string;
    icon?: string;
    subcategories: SubCategory[];
}

export interface MainCategory {
    name: string;
    href: string;
    groups: CategoryGroup[];
}

export const navCategories: MainCategory[] = [
    {
        name: "Women",
        href: "/products?category=Women",
        groups: [
            {
                name: "Clothing",
                subcategories: [
                    { name: "All Clothing", href: "/products?category=Women&subcategory=Clothing" },
                    { name: "Dresses", href: "/products?category=Women&subcategory=Dresses" },
                    { name: "Tops & T-shirts", href: "/products?category=Women&subcategory=Tops" },
                    { name: "Jeans", href: "/products?category=Women&subcategory=Jeans" },
                    { name: "Jumpers & Sweaters", href: "/products?category=Women&subcategory=Jumpers" },
                    { name: "Coats & Jackets", href: "/products?category=Women&subcategory=Coats" },
                    { name: "Skirts", href: "/products?category=Women&subcategory=Skirts" },
                    { name: "Pants & Leggings", href: "/products?category=Women&subcategory=Pants" },
                    { name: "Lingerie & Nightwear", href: "/products?category=Women&subcategory=Lingerie" },
                ]
            },
            {
                name: "Shoes",
                subcategories: [
                    { name: "All Shoes", href: "/products?category=Women&subcategory=Shoes" },
                    { name: "Boots", href: "/products?category=Women&subcategory=Boots" },
                    { name: "Sneakers", href: "/products?category=Women&subcategory=Sneakers" },
                    { name: "Heels", href: "/products?category=Women&subcategory=Heels" },
                    { name: "Sandals", href: "/products?category=Women&subcategory=Sandals" },
                ]
            },
            {
                name: "Bags",
                subcategories: [
                    { name: "All Bags", href: "/products?category=Women&subcategory=Bags" },
                    { name: "Handbags", href: "/products?category=Women&subcategory=Handbags" },
                    { name: "Backpacks", href: "/products?category=Women&subcategory=Backpacks" },
                    { name: "Totes", href: "/products?category=Women&subcategory=Totes" },
                ]
            },
            {
                name: "Beauty",
                subcategories: [
                    { name: "Makeup", href: "/products?category=Women&subcategory=Makeup" },
                    { name: "Skincare", href: "/products?category=Women&subcategory=Skincare" },
                    { name: "Perfume", href: "/products?category=Women&subcategory=Perfume" },
                ]
            }
        ]
    },
    {
        name: "Men",
        href: "/products?category=Men",
        groups: [
            {
                name: "Clothing",
                subcategories: [
                    { name: "T-shirts & Polos", href: "/products?category=Men&subcategory=Tshirts" },
                    { name: "Shirts", href: "/products?category=Men&subcategory=Shirts" },
                    { name: "Jeans", href: "/products?category=Men&subcategory=Jeans" },
                    { name: "Sweaters & Hoodies", href: "/products?category=Men&subcategory=Sweaters" },
                    { name: "Coats & Jackets", href: "/products?category=Men&subcategory=Coats" },
                    { name: "Suits & Blazers", href: "/products?category=Men&subcategory=Suits" },
                ]
            },
            {
                name: "Shoes",
                subcategories: [
                    { name: "Sneakers", href: "/products?category=Men&subcategory=Sneakers" },
                    { name: "Boots", href: "/products?category=Men&subcategory=Boots" },
                    { name: "Loafers", href: "/products?category=Men&subcategory=Loafers" },
                ]
            }
        ]
    },
    {
        name: "Kids",
        href: "/products?category=Kids",
        groups: [
            {
                name: "Girls",
                subcategories: [
                    { name: "Dresses", href: "/products?category=Kids&subcategory=GirlsDresses" },
                    { name: "Tops", href: "/products?category=Kids&subcategory=GirlsTops" },
                ]
            },
            {
                name: "Boys",
                subcategories: [
                    { name: "Tops", href: "/products?category=Kids&subcategory=BoysTops" },
                    { name: "Pants", href: "/products?category=Kids&subcategory=BoysPants" },
                ]
            },
            {
                name: "Toys",
                subcategories: [
                    { name: "Action Figures", href: "/products?category=Kids&subcategory=ToysFigures" },
                    { name: "Board Games", href: "/products?category=Kids&subcategory=ToysGames" },
                ]
            }
        ]
    },
    {
        name: "Home",
        href: "/products?category=Home",
        groups: [
            {
                name: "Decor",
                subcategories: [
                    { name: "Wall Art", href: "/products?category=Home&subcategory=WallArt" },
                    { name: "Vases", href: "/products?category=Home&subcategory=Vases" },
                ]
            },
            {
                name: "Textiles",
                subcategories: [
                    { name: "Bedding", href: "/products?category=Home&subcategory=Bedding" },
                    { name: "Curtains", href: "/products?category=Home&subcategory=Curtains" },
                ]
            }
        ]
    },
    {
        name: "Electronics",
        href: "/products?category=Electronics",
        groups: [
            {
                name: "Gaming",
                subcategories: [
                    { name: "Consoles", href: "/products?category=Electronics&subcategory=Consoles" },
                    { name: "Games", href: "/products?category=Electronics&subcategory=Games" },
                ]
            },
            {
                name: "Audio",
                subcategories: [
                    { name: "Headphones", href: "/products?category=Electronics&subcategory=Headphones" },
                    { name: "Speakers", href: "/products?category=Electronics&subcategory=Speakers" },
                ]
            }
        ]
    }
];
