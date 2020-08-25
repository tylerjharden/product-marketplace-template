import { Selector } from 'testcafe';
import faker from 'faker';
import { ClientFunction } from 'testcafe';
import { Role } from 'testcafe';
import ItemShowPage from './pages/itemshow';
import ItemShowEdit from './pages/itemedit';

fixture`Basic complete happy scenario`.page(process.env.MPKIT_URL);

const buyerRegister = Role(process.env.MPKIT_LOGURL, async t => {
    await t
      .click(Selector('main').find('p').withText('Register'))
      .typeText(emailInput, 'johnsmith@email.com')
      .typeText(passInput, 'password')
      .typeText(usernameInput, 'johnsmith')
      .click(Selector('button').withText('Sign Up'));
});

const buyerLogging = Role(process.env.MPKIT_LOGURL, async t => {
  await t
    .typeText(emailInput, 'johnsmith@email.com')
    .typeText(passInput, 'password')
    .click(logInBtn)
    .expect(Selector('main').withText(loginConfirmation).exists)
    .ok('message ' + loginConfirmation + " doesn't exists")
});

const userRegister = Role(process.env.MPKIT_LOGURL, async t => {
    await t
      .click(Selector('main').find('p').withText('Register'))
      .typeText(emailInput, 'user@email.com')
      .typeText(passInput, 'password')
      .typeText(usernameInput, 'arnold01')
      .click(Selector('button').withText('Sign Up'))
});

const userLogging = Role(process.env.MPKIT_LOGURL, async t => {
      await t
      .typeText(emailInput, 'user@email.com')
      .typeText(passInput, 'password')
      .click(logInBtn)
      .expect(Selector('main').withText(loginConfirmation).exists)
      .ok('message ' + loginConfirmation + " doesn't exists");
});

const sellerRegister = Role(process.env.MPKIT_LOGURL, async t => {
      await t.click(Selector('main').find('p').withText('Register'))
      .typeText(emailInput, NewEmail)
      .typeText(passInput, NewPassword)
      .typeText(usernameInput, NewUsername)
      .click(Selector('button').withText('Sign Up'))
      .expect(Selector('main').withText(signupConfirmation).exists)
      .ok('message ' + signupConfirmation + " doesn't exists");
});

const sellerLogging = Role(process.env.MPKIT_LOGURL, async t => {
      await t
      .typeText(emailInput, NewEmail)
      .typeText(passInput, NewPassword)
      .click(logInBtn)
      .expect(Selector('main').withText(loginConfirmation).exists)
      .ok('message ' + loginConfirmation + " doesn't exists");
});

const signupConfirmation = 'Your account has been created';
const loginConfirmation = 'Logged in'
const getURL = ClientFunction(() => window.location.href);
const emailInput = 'label #email';
const passInput = 'label #password';
const usernameInput = 'label #username';
const nameField = '#name';
const descriptionField = '#description';
const priceField = '#price';
const editURL = '/items/edit?id=';
const NewEmail = faker.internet.email().toLowerCase();
const NewPassword = faker.internet.password();
const NewUsername = faker.name.findName();
const logInBtn = Selector('button').withText('Log in');
const item = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  price: '10000',
};

const editedItem = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  price: '5000',
};
const clearField = 'ctrl+a delete';
const mainPage = Selector('header').find('span').withText('MVP Marketplace');

test(`Admin Panel test`, async (t) => {
  await t
    .click(Selector('header').find('a').withText('Log in'))
    .typeText(emailInput, 'admin@example.com')
    .typeText(passInput, 'password')
    .click(logInBtn)
    .click(Selector('header').find('a').withText('Admin'))
    .click(Selector('a').withText('Users'))
    await t
    const users = Selector('tbody').find('td')
    await t.expect(users.count).gt(5)
    .click(Selector('a').withText('Items'))
    await t
    const smthg = Selector('div').find('.flex')
    await t.expect(smthg.count).gt(5)
    .click(Selector('a').withText('Orders'))
    const orders = Selector('tbody').find('tr')
    await t.expect(orders.count).gt(1)
    .click(Selector('a').withText('Categories'))
    const categories = Selector('tbody').find('tr')
    await t.expect(categories.count).gt(15)
    .click(Selector('a').withText('Home'))
    .click(Selector('a').withText('Activities'))
    .click(Selector('a').withText('Setup'))

});

test(`Logging attempt with empty data`, async (t) => {
  await t
    .useRole(buyerRegister)
    .useRole(userRegister)
    .click(Selector('header').find('a').withText('Log in'))
    .click(logInBtn)
    .expect(Selector('label').withText('E-mail').textContent)
    .contains('cannot be blank')
    .expect(Selector('label').withText('Password').textContent)
    .contains('cannot be blank');
});

test(`Registration attempt with taken data`, async (t) => {
  await t
    .click(Selector('header').find('a').withText('Log in'))
    .click(Selector('main').find('p').withText('Register'))
    .typeText(emailInput, 'user@email.com')
    .typeText(passInput, NewPassword)
    .typeText(usernameInput, 'arnold01')
    .click(Selector('button').withText('Sign Up'))
    .expect(Selector('html').textContent)
    .contains('already taken');
});

test(`Logging attempt with wrong data`, async (t) => {
  await t
    .click(Selector('header').find('a').withText('Log in'))
    .typeText(emailInput, 'user@email.com')
    .typeText(passInput, 'wrongpassword')
    .click(logInBtn)
    .expect(Selector('html').textContent)
    .contains('Invalid email or password');
});

test(`Register Test`, async (t) => {
  await t
    .useRole(sellerRegister)
    .click(Selector('header').find('a').withText('Dashboard'))
    .click(Selector('a').withText('Profile'))
    await t.expect(Selector('main').textContent)
    .contains(NewEmail)
});

test('Item listing', async (t) => {

  //listing the item for sale
  await t.useRole(sellerLogging)
  await t.click(Selector('a').withText('List your item'))
  .typeText(Selector(nameField), item.name)
  .typeText(descriptionField, item.description)
  .doubleClick(Selector(priceField))
  .pressKey(clearField)
  .typeText(priceField, item.price)
  .click(Selector('button').withText('browse your computer'))
  .setFilesToUpload(Selector('main').find('[name="files[]"]'), ['_uploads_/testimage.png'])
  .click(Selector('button').withText('Submit'))
  await t.expect('img[src="_uploads_/testimage.png"]').ok()
  .click(mainPage);
});

test('Edit item', async (t) => {

  await t
    //searching item by its name
    .useRole(sellerLogging)
    .typeText('input[name="k"]', item.name)
    .click(Selector('main').find('button').withText('Search'))
    .expect(Selector('main').withText(item.name).exists)
    .ok("'Item#name could not be found")
    .click(Selector('main').find('h2 a').withText(item.name))
    const page = new ItemShowPage(item)
    await t.expect('img[src="_uploads_/testimage.png"]').ok()
    //checks if all data is correct
    .expect(page.name.exists)
    .ok()
    .expect(page.description.exists)
    .ok()
    .expect(page.price.innerText).eql('$10,000', 'check element text');
  await t.click(page.editbutton);
  //change of item information

  await t
    .doubleClick(nameField)
    .pressKey(clearField)
    .typeText(nameField, editedItem.name)
    .doubleClick(descriptionField)
    .pressKey(clearField)
    .typeText(descriptionField, editedItem.description)
    .doubleClick(priceField)
    .pressKey(clearField)
    .typeText(priceField, editedItem.price)
    .click(Selector('button').withText('Submit'))
    const editpage = new ItemShowEdit(editedItem)
    await t.expect(editpage.name.exists)
    .ok()
    .expect(editpage.description.exists)
    .ok()
    .expect(editpage.price.innerText).eql('$5,000', 'check element text')
    .click(Selector('span').withText('MVP Marketplace'))
    .click(Selector('header').find('button').withText('Log out')) //Logging out from seller account
    //logging at buyer account and checks if seller item after edit exists
    .useRole(buyerLogging)
    .typeText('input[name="k"]', editedItem.name)
    .click(Selector('button').withText('Search'))
    .click(Selector('main').find('h2 a').withText(editedItem.name))
    //Buying item, logging off from buyer account
    .click(Selector('button').withText('Buy'));
  await t
    //.click(Selector('main').find('button').withText('Checkout'))
    .click(Selector('header').find('a').withText('Dashboard'))
    //.click(Selector('main').find('a').withText('Your orders').nth(1))
    //.click(Selector('button').withText('Cancel'))
    .click(Selector('button').withText('Log out'));
});

test('Delete item test', async (t) => {
  await t
    //checks if bought item still exists at auctions
    .useRole(sellerLogging)
    .click(Selector('header').find('a').withText('Dashboard'))
    .click(Selector('main').find('a').withText('Your items'))
    .click(Selector('main').find('a').withText(editedItem.name))
    //deleting exist item
    .setNativeDialogHandler(() => true)
    .click(Selector('button').withText('Delete'))
    .click(Selector('button').withText('Log out'));
});

test('Breakin-in test, edition by none user', async (t) => {
  const notAuthorizedUser = 'Permission denied';
  await t
    .useRole(userLogging)
    .typeText('input[name="k"]', 'Watch')
    .click(Selector('main').find('button').withText('Search'))
    .click(Selector('main').find('h2 a').withText('Watch'));
  await t;
  var itemEditUrl = await getURL();
  var itemEditUrl = itemEditUrl.split('-');
  var editItemId = itemEditUrl[itemEditUrl.length - 1];
  await t.navigateTo(editURL + editItemId);
  await t
    .expect(Selector('div').withText(notAuthorizedUser).exists)
    .ok('message ' + notAuthorizedUser + " doesn't exists");
});
