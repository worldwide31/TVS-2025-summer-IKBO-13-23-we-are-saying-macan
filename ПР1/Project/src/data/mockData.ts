/**
 * Моковые данные для демонстрации
 */

// Моковые данные складов
export const mockWarehouses = [
  {
    id: '1',
    name: 'Центральный склад',
    address: 'г. Москва, ул. Складская, 1',
    capacity: 1000,
    description: 'Основной распределительный центр компании с холодильными камерами и зоной для хранения сухих продуктов.',
    createdAt: '2023-01-15T10:00:00.000Z',
    updatedAt: '2023-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Северный склад',
    address: 'г. Санкт-Петербург, проспект Складской, 42',
    capacity: 500,
    description: 'Склад для северных регионов с усиленной холодильной системой для длительного хранения.',
    createdAt: '2023-02-20T14:30:00.000Z',
    updatedAt: '2023-02-20T14:30:00.000Z'
  },
  {
    id: '3',
    name: 'Южный склад',
    address: 'г. Краснодар, ул. Логистическая, 15',
    capacity: 700,
    description: 'Распределительный центр для южных регионов с системой климат-контроля.',
    createdAt: '2023-03-10T09:15:00.000Z',
    updatedAt: '2023-03-10T09:15:00.000Z'
  }
];

// Функция для генерации даты истечения срока годности
const getExpiryDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Моковые данные продуктов
export const mockProducts = [
  // Продукты на Центральном складе
  {
    id: '1',
    warehouseId: '1',
    name: 'Молоко пастеризованное 3.2%',
    quantity: 120,
    marking: 'МЛК-2023-001',
    expiryDate: getExpiryDate(5),
    description: 'Пастеризованное молоко в пластиковых бутылках объемом 1 литр.',
    createdAt: '2023-05-01T08:00:00.000Z',
    updatedAt: '2023-05-01T08:00:00.000Z'
  },
  {
    id: '2',
    warehouseId: '1',
    name: 'Сыр Российский',
    quantity: 50,
    marking: 'СЫР-2023-001',
    expiryDate: getExpiryDate(30),
    description: 'Сыр Российский в вакуумной упаковке по 300 грамм.',
    createdAt: '2023-05-02T10:15:00.000Z',
    updatedAt: '2023-05-02T10:15:00.000Z'
  },
  {
    id: '3',
    warehouseId: '1',
    name: 'Хлеб пшеничный',
    quantity: 80,
    marking: 'ХЛБ-2023-001',
    expiryDate: getExpiryDate(2),
    description: 'Хлеб пшеничный формовой, 500 грамм.',
    createdAt: '2023-05-03T11:30:00.000Z',
    updatedAt: '2023-05-03T11:30:00.000Z'
  },
  {
    id: '4',
    warehouseId: '1',
    name: 'Колбаса вареная',
    quantity: 40,
    marking: 'КЛБ-2023-001',
    expiryDate: getExpiryDate(15),
    description: 'Колбаса вареная высшего сорта, батон 500 грамм.',
    createdAt: '2023-05-04T14:45:00.000Z',
    updatedAt: '2023-05-04T14:45:00.000Z'
  },
  {
    id: '5',
    warehouseId: '1',
    name: 'Яблоки Голден',
    quantity: 200,
    marking: 'ФРТ-2023-001',
    expiryDate: getExpiryDate(20),
    description: 'Яблоки сорта Голден, коробки по 5 кг.',
    createdAt: '2023-05-05T09:20:00.000Z',
    updatedAt: '2023-05-05T09:20:00.000Z'
  },
  {
    id: '6',
    warehouseId: '1',
    name: 'Макароны спагетти',
    quantity: 150,
    marking: 'МКР-2023-001',
    expiryDate: getExpiryDate(180),
    description: 'Макароны спагетти высшего сорта, пачки по 450 грамм.',
    createdAt: '2023-05-06T13:10:00.000Z',
    updatedAt: '2023-05-06T13:10:00.000Z'
  },
  
  // Продукты на Северном складе
  {
    id: '7',
    warehouseId: '2',
    name: 'Творог 9%',
    quantity: 70,
    marking: 'МЛП-2023-001',
    expiryDate: getExpiryDate(7),
    description: 'Творог 9% жирности, пластиковые контейнеры по 200 грамм.',
    createdAt: '2023-05-07T08:30:00.000Z',
    updatedAt: '2023-05-07T08:30:00.000Z'
  },
  {
    id: '8',
    warehouseId: '2',
    name: 'Масло сливочное 82.5%',
    quantity: 60,
    marking: 'МСЛ-2023-001',
    expiryDate: getExpiryDate(45),
    description: 'Масло сливочное 82.5% жирности, пачки по 200 грамм.',
    createdAt: '2023-05-08T10:45:00.000Z',
    updatedAt: '2023-05-08T10:45:00.000Z'
  },
  {
    id: '9',
    warehouseId: '2',
    name: 'Рыба замороженная',
    quantity: 30,
    marking: 'РЫБ-2023-001',
    expiryDate: getExpiryDate(60),
    description: 'Минтай свежемороженый, упаковки по 1 кг.',
    createdAt: '2023-05-09T11:15:00.000Z',
    updatedAt: '2023-05-09T11:15:00.000Z'
  },
  
  // Продукты на Южном складе
  {
    id: '10',
    warehouseId: '3',
    name: 'Томаты свежие',
    quantity: 100,
    marking: 'ОВЩ-2023-001',
    expiryDate: getExpiryDate(10),
    description: 'Томаты свежие, ящики по 5 кг.',
    createdAt: '2023-05-10T09:00:00.000Z',
    updatedAt: '2023-05-10T09:00:00.000Z'
  },
  {
    id: '11',
    warehouseId: '3',
    name: 'Огурцы свежие',
    quantity: 80,
    marking: 'ОВЩ-2023-002',
    expiryDate: getExpiryDate(8),
    description: 'Огурцы свежие, ящики по 3 кг.',
    createdAt: '2023-05-11T10:30:00.000Z',
    updatedAt: '2023-05-11T10:30:00.000Z'
  },
  {
    id: '12',
    warehouseId: '3',
    name: 'Мед цветочный',
    quantity: 40,
    marking: 'МЁД-2023-001',
    expiryDate: getExpiryDate(365),
    description: 'Мед цветочный натуральный, стеклянные банки по 0.5 кг.',
    createdAt: '2023-05-12T13:45:00.000Z',
    updatedAt: '2023-05-12T13:45:00.000Z'
  },
  {
    id: '13',
    warehouseId: '3',
    name: 'Сок апельсиновый',
    quantity: 90,
    marking: 'СОК-2023-001',
    expiryDate: getExpiryDate(-5), // Просроченный товар для демонстрации
    description: 'Сок апельсиновый без консервантов, упаковки Тетра Пак по 1 литру.',
    createdAt: '2023-05-13T14:20:00.000Z',
    updatedAt: '2023-05-13T14:20:00.000Z'
  }
];