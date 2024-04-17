let statuses = [];
showWaiting();

axios.get("http://localhost:3000/api/orderStatuses").then(({data}) => {
  statuses = data; //gets order status

  return axios.get("http://localhost:3000/api/orders"); //then gets all orders
}).then(({data}) => {
  let orders = data.map((o) => { //loops over those orders, as assigns order status description
    return {
      ...o,
      orderStatus: statuses.find((d) => d.id === o.orderStatusId).description,
    };
  })
  showOrderList('#order-list', orders);
}).catch((err) => showError('#order-list', err)).finally(() => {
  setTimeout(hideWaiting, 1500)
});//catching an error