import { CategoryErrorPipe } from './category-error.pipe';

describe('CategoryErrorPipe', () => {
  let pipe: CategoryErrorPipe;

  beforeEach(() => {
    pipe = new CategoryErrorPipe(); // Instancia del pipe
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy(); // Verifica que el pipe se crea correctamente
  });

  it('should return an error message when errorMessage is provided', () => {
    const result = pipe.transform([], 'Error al cargar categorías');
    expect(result).toEqual([{ name: 'Error al cargar categorías' }]); // Verifica el mensaje de error
  });

  it('should return no categories available message when categories is empty', () => {
    const result = pipe.transform([], '');
    expect(result).toEqual([{ name: 'No hay categorías disponibles' }]); // Verifica el mensaje de no hay categorías
  });

  it('should return the categories array when valid categories are provided', () => {
    const categories = [{ name: 'Categoría 1' }, { name: 'Categoría 2' }];
    const result = pipe.transform(categories, '');
    expect(result).toEqual(categories); // Verifica que devuelve las categorías originales
  });

  it('should return no categories available message when categories is empty', () => {
    const result = pipe.transform([], '');
    expect(result).toEqual([{ name: 'No hay categorías disponibles' }]); // Verifica el mensaje de no hay categorías
  });

});
