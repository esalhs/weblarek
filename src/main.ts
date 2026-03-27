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
let orderForm: OrderForm | null = null;
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
let contactsForm: ContactsForm | null = null;
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(events, modalContainer)

function renderCatalog(): void {
  const products = catalog.getProducts();

  const cards = products.map((product) => {
    const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
    const card = new CardCatalog(events, cardElement);

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
  const cardElement = cloneTemplate<HTMLElement>(cardFullTemplate);
  const card = new CardFull(events, cardElement);

  const renderedCard = card.render({
    ...product,
    image: `${CDN_URL}${product.image}`
  })

  const hasPrice = product.price !== null;
  const inCart = cart.hasProduct(product.id);
  card.setButtonState(inCart, hasPrice);

  modal.setContent(renderedCard);
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

function openBasket(): void {
  const products = cart.getProducts();

  const renderedCards = products.map((product, index) => {
    const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const card = new CardBasket(events, cardElement);

    return card.render({
      ...product,
      index: index + 1
    });
  });

  const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
  const basket = new Basket(events, basketElement);

  basket.setItems(renderedCards);
  basket.setTotalPrice(cart.getTotalPrice())
  basket.setButtonState(cart.getCount() > 0)

  modal.setContent(basket.render());
  modal.open();
}

function updateOrderForm(): void {
  
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  const filteredErrors = Object.fromEntries(Object.entries(errors).filter(([key]) => key === 'payment' || key === 'address'));

  const chosenPayment = Boolean(buyerData.payment);
  const hasAddress = buyerData.address.trim() !== '';
  const noErrors = Object.keys(filteredErrors).length === 0;
  const canContinue = chosenPayment && hasAddress && noErrors;

  if (orderForm) {
    orderForm.showErrors(filteredErrors);
    orderForm.setButtonState(canContinue);
  }
}

function openOrderForm() {
  const orderFormElement = cloneTemplate<HTMLElement>(orderFormTemplate);
  orderForm = new OrderForm(events, orderFormElement);

  const buyerData = buyer.getData();

  const renderedForm = orderForm.render({
    payment: buyerData.payment,
    address: buyerData.address
  })

  updateOrderForm();

  modal.setContent(renderedForm);
  modal.open()
}

function updateContactsForm(): void {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  const filteredErrors = Object.fromEntries(Object.entries(errors).filter(([key]) => key === 'email' || key === 'phone'));

  const hasEmail = buyerData.email.trim() !== '';
  const hasPhone = buyerData.phone.trim() !== '';
  const noErrors = Object.keys(filteredErrors).length === 0;
  const canPurchase = hasEmail && hasPhone && noErrors;

  if (contactsForm) {
    contactsForm.showErrors(filteredErrors);
    contactsForm.setButtonState(canPurchase);
  }
}

function openContactsForm() {
  const contactsFormElement = cloneTemplate<HTMLElement>(contactsFormTemplate);
  contactsForm = new ContactsForm(events, contactsFormElement);

  const buyerData = buyer.getData();

  const renderedForm = contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone
  })

  updateContactsForm();

  modal.setContent(renderedForm);
  modal.open();
}

async function submitOrder(): Promise<void> {
  const products = cart.getProducts().map((item) => item.id);
  const buyerData = buyer.getData();
  const total = cart.getTotalPrice();

  const orderData = {
    ...buyerData,
    items: products,
    total
  }
try {
  const response = await server.sendOrder(orderData);

  cart.clear();
  buyer.clear();

  const successFormElement = cloneTemplate<HTMLElement>(successTemplate);
  const successForm = new Success(events, successFormElement);

  const renderedSuccess = successForm.render({
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

events.on('cart:changed', updateHeaderCounter);

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