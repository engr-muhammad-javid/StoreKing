export const DropdownMenuData = [
  {
    name: "Food",
    url: "/product?category=food99",
    children: [
      {
        name: "Fruits & Vegetables",
        url: "/product?category=fruits-vegetables189136",
        children: [
          {
            name: "Fresh Vegetables",
            url: "/product?category=fresh-vegetables490128",

            children: [
              {
                name: "Fresh Vegetables",
                url: "/product?category=fresh-vegetables490128",
              },
              {
                name: "Fresh Fruits",
                url: "/product?category=fresh-fruits325127",
              },
              {
                name: "Nuts & Dry Fruits",
                url: "/product?category=nuts-dry-fruits400103",
              }
            ],

          },
          {
            name: "Fresh Fruits",
            url: "/product?category=fresh-fruits325127",
          },
          {
            name: "Nuts & Dry Fruits",
            url: "/product?category=nuts-dry-fruits400103",
          }
        ]
      },
      {
        name: "Meat & Fish",
        url: "/product?category=meat-fish378118",
        children: [
          {
            name: "Chicken",
            url: "/product?category=chicken115130",
          },
          {
            name: "Beef",
            url: "/product?category=beef225164",
          },
          {
            name: "Frozen Fish",
            url: "/product?category=frozen-fish217190",
          }
        ]
      },
      // Add other categories similarly...
    ]
  },
  {
    name: "Cleaning Supplies",
    url: "/product?category=cleaning-supplies43",
    children: [
      {
        name: "Dishwashing Supplies",
        url: "/product?category=dishwashing-supplies132115",
      },
      {
        name: "Laundry",
        url: "/product?category=laundry250161",
      },
      {
        name: "Toilet Cleaners",
        url: "/product?category=toilet-cleaners306156",
      }
      // ...
    ]
  },
  {
    name: "Personal Care",
    url: "/product?category=personal-care94",
    children: [
      {
        name: "Women’s Care",
        url: "/product?category=womens-care122154",
        children: [
          {
            name: "Women’s Soap",
            url: "/product?category=womens-soap185129",
          },
          // ...
        ]
      },
      {
        name: "Men’s Care",
        url: "/product?category=mens-care204124",
        children: [
          {
            name: "Men’s Soap",
            url: "/product?category=mens-soap453106",
          },
          // ...
        ]
      }
    ]
  }
];
