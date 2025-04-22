import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define the shape of the decoded JWT payload
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

// Extend Express Request type to include the user object from JWT
interface CustomRequest extends Request {
  user?: CustomJwtPayload;
}

// Middleware to verify JWT token
export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  // Extract token from Authorization header or cookies
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token;

  if (!token) {
    res.status(403).json({ message: 'Access denied, token missing!' });
    return;
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    req.user = decoded; // Attach the decoded payload to the request object

    next(); // Continue to the next middleware
  } catch (err) {
    res.status(401).json({ message: 'Invalid token!' });
  }
};

// Middleware to check user's role
export const checkRole = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    // Ensure req.user is populated and has a role
    if (!req.user || !req.user.role) {
      res.status(403).json({ message: 'Unauthorized: No role found' });
      return;
    }

    // Check if the user's role is one of the allowed roles
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `You are not authorized. Your role is ${req.user.role}, but an authorized role is required.`,
      });
      return;
    }

    next(); // Continue to the next middleware if the role is valid
  };
};