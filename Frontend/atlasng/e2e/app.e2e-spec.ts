import { CimaPage } from './app.po';

describe('cima App', function() {
  let page: CimaPage;

  beforeEach(() => {
    page = new CimaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
