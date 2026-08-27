# FoodFlow Simple Revenue Page

This version does exactly what you described:

1. Someone clicks a food item.
2. Its price is added to TOTAL REVENUE.
3. The order count increases.
4. Average order value updates.
5. The sale appears in Recent Sales.
6. Data is saved in the browser using localStorage, so refreshing the page does not erase it.

Example:
Click Burger → ₹120
Click Pizza → +₹180
Revenue becomes ₹300.

Important: this is local browser storage, not a shared online database. If you want multiple people/devices to click sales and have ONE revenue number update everywhere in real time, the next step is connecting this to Firebase or Supabase.
