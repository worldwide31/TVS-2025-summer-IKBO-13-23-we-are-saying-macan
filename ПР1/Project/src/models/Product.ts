/**
 * Класс представляющий продукт на складе
 */
export class Product {
  id: string;
  warehouseId: string;
  name: string;
  quantity: number;
  marking: string;
  expiryDate: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  
  constructor(
    id: string,
    warehouseId: string,
    name: string,
    quantity: number,
    marking: string,
    expiryDate: Date,
    description: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.warehouseId = warehouseId;
    this.name = name;
    this.quantity = quantity;
    this.marking = marking;
    this.expiryDate = expiryDate;
    this.description = description;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
  
  /**
   * Проверка, истек ли срок годности продукта
   */
  isExpired(): boolean {
    return new Date() > this.expiryDate;
  }
  
  /**
   * Получить дни до истечения срока годности
   */
  getDaysUntilExpiry(): number {
    const now = new Date();
    const diff = this.expiryDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  
  /**
   * Получить статус товара
   */
  getStatus(): 'expired' | 'warning' | 'good' {
    if (this.isExpired()) {
      return 'expired';
    }
    
    const daysUntilExpiry = this.getDaysUntilExpiry();
    if (daysUntilExpiry <= 7) {
      return 'warning';
    }
    
    return 'good';
  }
  
  /**
   * Получить данные продукта для хранения
   */
  toJSON(): object {
    return {
      id: this.id,
      warehouseId: this.warehouseId,
      name: this.name,
      quantity: this.quantity,
      marking: this.marking,
      expiryDate: this.expiryDate.toISOString(),
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
  
  /**
   * Создать экземпляр продукта из JSON данных
   */
  static fromJSON(json: any): Product {
    return new Product(
      json.id,
      json.warehouseId,
      json.name,
      json.quantity,
      json.marking,
      new Date(json.expiryDate),
      json.description,
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
  }
}