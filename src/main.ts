import './scss/styles.scss';

import { CatalogModel } from './components/base/Models/CatalogModel';
import { CartModel } from './components/base/Models/CartModel';
import { BuyerModel } from './components/base/Models/BuyerModel';
import { ServerClass} from './components/base/Models/ServerClass';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants'

const catalog = new CatalogModel();
const cart = new CartModel();
const buyer = new BuyerModel();

const api = new Api(API_URL);
const server = new ServerClass(api);

catalog.setProducts(apiProducts.items);
console.log('Все товары из каталога:', catalog.getProducts());

const firstId = apiProducts.items[0].id;
console.log('Товар по id:', catalog.getProductById(firstId));

catalog.setSelectedProduct(firstId);
console.log('Выбранный товар:', catalog.getSelectedProduct());

cart.addProduct(apiProducts.items[0]);
console.log('Товары в корзине:', cart.getProducts());
console.log('Корзина содержит товар с id?', cart.hasProduct(firstId));
console.log('Количество товаров в корзине:', cart.getCount());
console.log('Общая стоимость корзины:', cart.getTotalPrice());
cart.removeProduct(apiProducts.items[0]);
console.log('Корзина после удаления товара:', cart.getProducts());
cart.clear();
console.log('Корзина после очистки:', cart.getProducts());

buyer.setData({ email: 'test@example.com' });
buyer.setData({ phone: '1234567890' });
console.log('Данные покупателя:', buyer.getData());
console.log('Ошибки валидации:', buyer.validate());
buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());

async function loadProducts() {
  const data = await server.fetchProducts()
  catalog.setProducts(data.items)
  console.log('Каталог:', catalog.getProducts())
}

loadProducts()