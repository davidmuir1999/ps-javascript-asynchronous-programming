let statusReq = axios.get("http://localhost:3000/api/orderStatuses");
let addressReq = axios.get("http://localhost:3000/api/addresses");

let statuses = [];
let addresses = [];
showWaiting();

Promise.allSettled([statusReq, addressReq]).then(([statusRes, addressRes]) => {
  if(statusRes.status === 'fulfilled'){
    statuses = statusRes.value.data;
  } else {
    window.alert('Order status error: '+ statusRes.reason.message);
  }
  if(addressRes.status === 'fulfilled'){
    addresses = addressRes.value.data;
  } else {
    window.alert('Order status error: '+ addressRes.reason.message);
  }
  return axios.get("http://localhost:3000/api/orders");
})
.then(({data}) => {
  let orders = data.map((d) => {
    const addr = addresses.find((a) => a.id === d.shippingAddress);
    return {
      ...d,
      orderStatus: statuses.find((s) => s.id === d.orderStatusId).description,
      shippingAddressText: `${addr.street} ${addr.city}, ${addr.state} ${addr.zipcode}`
    }
  })
  showOrderList('#order-list', orders);
}).catch((err) => showError('#order-list', err)).finally(() => {
  setTimeout(hideWaiting, 1500)
});//catching an error