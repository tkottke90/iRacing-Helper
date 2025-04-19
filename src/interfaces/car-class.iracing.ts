/**
 * Interface representing an iRacing car class data structure
 * Generated from the iRacing API response
 */
export interface iRacingCarClass {
  /** The unique identifier for the car class */
  car_class_id: number;
  /** List of cars that belong to this class */
  cars_in_class: {
    /** The directory path for the car assets */
    car_dirpath: string;
    /** The unique identifier for the car */
    car_id: number;
    /** Whether rain is enabled for this car */
    rain_enabled: boolean;
    /** Whether the car is retired */
    retired: boolean;
  }[];
  /** Customer ID (0 for official iRacing car classes) */
  cust_id: number;
  /** The full name of the car class */
  name: string;
  /** Whether rain is enabled for this car class */
  rain_enabled: boolean;
  /** The relative speed rating of the car class */
  relative_speed: number;
  /** The abbreviated name of the car class */
  short_name: string;
}
