import './scss/styles.scss';

import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ServerClass} from './components/Models/ServerClass';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/CardCatalog';
import { CardFull } from './components/View/CardFull';
import { CardBasket } from './components/View/CardBasket';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { IOrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { IContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

const events = new EventEmitter();

const catalog = new CatalogModel(events);
const cart = new CartModel(events);
const buyer = new BuyerModel(events);

const api = new Api(API_URL);
const server = new ServerClass(api);

const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardFullTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(events, modalContainer)

const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basket = new Basket(events, basketElement);

basket.setItems([]);
basket.setTotalPrice(0);
basket.setButtonState(false);

const orderFormElement = cloneTemplate<HTMLElement>(orderFormTemplate);
const orderForm = new OrderForm(events, orderFormElement);

const contactsFormElement = cloneTemplate<HTMLElement>(contactsFormTemplate);
const contactsForm = new ContactsForm(events, contactsFormElement);

const successElement = cloneTemplate<HTMLElement>(successTemplate);
const success = new Success(events, successElement);

const fullCardElement = cloneTemplate<HTMLElement>(cardFullTemplate);
const fullCard = new CardFull(fullCardElement, () => events.emit('card:action'));

function renderCatalog(): void {
  const products = catalog.getProducts();

  const cards = products.map((product) => {
    const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, () => events.emit('card:open', { id: product.id }));

    return card.render({
      ...product,
      image: `${CDN_URL}${product.image}`
    })
  })

  gallery.setItems(cards)
}

function updateHeaderCounter(): void {
  header.counter = cart.getCount();
}

function openCard(id: string): void {
  catalog.setSelectedProduct(id)
}

function renderPreviewCard(): void {
  const product = catalog.getSelectedProduct();

  if (!product) {
    return;
  }

  fullCard.render({
    ...product,
    image: `${CDN_URL}${product.image}`
  })

  const hasPrice = product.price !== null;
  const inCart = cart.hasProduct(product.id);
  fullCard.setButtonState(inCart, hasPrice);

  modal.setContent(fullCard.render());
  modal.open();
}

function addToCart(id: string): void {
  const product = catalog.getProductById(id);

  if (!product) {
    return;
  }

  cart.addProduct(product);
  modal.close()
}

function removeFromCart(id: string): void {
  const product = catalog.getProductById(id);

  if (!product) {
    return;
  }

  cart.removeProduct(product);
  modal.close()
}

function cardAction(): void {
  const product = catalog.getSelectedProduct();

  if (!product) {
    return;
  }

  if (cart.hasProduct(product.id)) {
    cart.removeProduct(product);
  } else {
    cart.addProduct(product);
  }

  modal.close();
}

function updateBasket(): void {
  const products = cart.getProducts();

  const renderedCards = products.map((product, index) => {
    const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);

    const card = new CardBasket(
      cardElement,
      () => events.emit('card:remove', { id: product.id })
    );

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1
    });
  });

  basket.setItems(renderedCards);
  basket.setTotalPrice(cart.getTotalPrice());
  basket.setButtonState(cart.getCount() > 0);
}

function openBasket(): void {
  modal.setContent(basket.render()); 
  modal.open();
}

function updateOrderForm(): void {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  const filteredErrors = Object.fromEntries(Object.entries(errors).filter(([key]) => key === 'payment' || key === 'address'));

  if (buyerData.payment) {
    orderForm.payment = buyerData.payment;
  }
  orderForm.address = buyerData.address;

  const canContinue = Object.keys(filteredErrors).length === 0;

  orderForm.showErrors(filteredErrors);
  orderForm.setButtonState(canContinue);
}

function openOrderForm() {
  const renderedForm = orderForm.render({
    payment: undefined,
    address: ''
  })

  updateOrderForm();

  modal.setContent(renderedForm);
  modal.open()
}

function updateContactsForm(): void {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  const filteredErrors = Object.fromEntries(Object.entries(errors).filter(([key]) => key === 'email' || key === 'phone'));

  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;

  const canPurchase = Object.keys(filteredErrors).length === 0;

  contactsForm.showErrors(filteredErrors);
  contactsForm.setButtonState(canPurchase);
}

function openContactsForm() {
  const renderedForm = contactsForm.render({
    email: '',
    phone: ''
  })

  updateContactsForm();

  modal.setContent(renderedForm);
  modal.open();
}

async function submitOrder(): Promise<void> {
  const products = cart.getProducts();
  const buyerData = buyer.getData();
  const total = cart.getTotalPrice();

  const orderData = {
    ...buyerData,
    items: products.map((item) => item.id),
    total
  }
try {
  const response = await server.sendOrder(orderData);

  cart.clear();
  buyer.clear();

  const renderedSuccess = success.render({
    total: response.total
  })

  modal.setContent(renderedSuccess);
  modal.open();
} catch (error) {
  console.error('Ошибка при оформлении заказа:', error);
}
}


events.on('catalog:changed', renderCatalog);

events.on('preview:changed', renderPreviewCard);

events.on('cart:changed', () => {updateHeaderCounter(); updateBasket()});

events.on('buyer:changed', () => {
  updateOrderForm(); 
  updateContactsForm()
});

events.on('contacts:submit', submitOrder);

events.on<{ id: string }>('card:open', (data) => {
  openCard(data.id);
});

events.on('modal:close', () => {
  modal.close();
});

events.on<{ id: string }>('card:add', (data) => {
  addToCart(data.id);
});

events.on<{ id: string }>('card:remove', (data) => {
  removeFromCart(data.id);
});

events.on('card:action', cardAction)

events.on('basket:open', openBasket);

events.on('order:open', openOrderForm);

events.on<Partial<IOrderForm>>('order:change', (data) => {
  buyer.setData(data);
});

events.on('order:submit', openContactsForm);

events.on<Partial<IContactsForm>>('contacts:change', (data) => {
  buyer.setData(data);
});

async function loadProducts() {
  try {
    const data = await server.fetchProducts();
    catalog.setProducts(data.items);
  } catch (error) {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  }
}

loadProducts();