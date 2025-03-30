export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  
  export function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }