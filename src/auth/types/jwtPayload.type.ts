import { UserRole } from './user-role.enum'; // Import enum như giá trị

export type JwtPayload = {
  email: string;
  sub: string;
  role: (typeof UserRole)[keyof typeof UserRole]; // Sử dụng typeof UserRole để chỉ ra kiểu
};
