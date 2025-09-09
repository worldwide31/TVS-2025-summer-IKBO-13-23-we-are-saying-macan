/**
 * Класс представляющий склад
 */
export class Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  
  constructor(
    id: string,
    name: string,
    address: string,
    capacity: number,
    description: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.capacity = capacity;
    this.description = description;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
  
  /**
   * Проверка, есть ли на складе свободное место
   */
  hasCapacity(totalProductQuantity: number): boolean {
    return totalProductQuantity < this.capacity;
  }
  
  /**
   * Получить процент занятости склада
   */
  getOccupancyPercentage(totalProductQuantity: number): number {
    if (this.capacity === 0) return 100;
    return Math.min(100, Math.round((totalProductQuantity / this.capacity) * 100));
  }
  
  /**
   * Получить данные склада для хранения
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      capacity: this.capacity,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
  
  /**
   * Создать экземпляр склада из JSON данных
   */
  static fromJSON(json: any): Warehouse {
    return new Warehouse(
      json.id,
      json.name,
      json.address,
      json.capacity,
      json.description,
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
  }
}