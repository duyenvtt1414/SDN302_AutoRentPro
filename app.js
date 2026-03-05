import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import session from 'express-session';
import { engine } from 'express-handlebars';
import cors from 'cors';

import routes from './routes/index.js';      
import uiRoutes from './routes/ui/index.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:5173',
    'https://localhost:3443'
  ],
  credentials: true,
};
app.use(cors(corsOptions));
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'autorent_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    },
  })
);

app.use(methodOverride('_method'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main',
    helpers: {
      ifEquals(a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
      },
    },
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/ui/login');
});

app.use('/ui', uiRoutes);

// Admin APIs
app.use('/api/admin', adminRoutes);

// API routes (JSON)
app.use(routes);

app.use((req, res) => {
  if (req.path.startsWith('/ui')) {
    return res.status(404).render('errors/404', { title: 'Not found' });
  }
  return res.status(404).json({
    error: { message: 'Not found', code: 'NOT_FOUND' },
  });
});

export default app;
