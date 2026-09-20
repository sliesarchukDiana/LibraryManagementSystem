import { expect } from 'chai';
import { Library } from '../src/services/Library';

describe('LibraryService', () => {
  let library: Library<{ id: string; name: string }>;

  beforeEach(() => {
    library = new Library<{ id: string; name: string }>();
  });

  it('receiveItemExpectedToAddToStorage', () => {
    library.add({ id: '1', name: 'Item 1' });
    expect(library.getAll()).to.have.lengthOf(1);
    expect(library.getAll()[0].id).to.equal('1');
  });

  it('receiveIdExpectedToFindItem', () => {
    library.add({ id: '1', name: 'Item 1' });
    const item = library.find('1');
    expect(item).to.not.be.undefined;
    expect(item?.name).to.equal('Item 1');
  });

  it('receiveInvalidIdExpectedToReturnUndefined', () => {
    const item = library.find('999');
    expect(item).to.be.undefined;
  });

  it('receiveIdExpectedToRemoveItem', () => {
    library.add({ id: '1', name: 'Item 1' });
    library.remove('1');
    expect(library.getAll()).to.be.empty;
  });
});
