import { create } from 'zustand';
import { supabase } from '../services/supabase';

const mapProduct = (p) => ({
  _id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: Number(p.price),
  salePrice: p.sale_price ? Number(p.sale_price) : null,
  category: p.categories, // Joined object
  sizes: p.sizes,
  images: p.images,
  stock: p.stock,
  featured: p.featured,
  isNew: p.is_new,
  rating: Number(p.rating),
  numReviews: p.num_reviews,
  createdAt: p.created_at
});

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  categories: [],
  total: 0,
  page: 1,
  pages: 1,
  isLoading: false,
  error: null,

  // Filters
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    sort: 'newest',
    search: '',
  },

  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    page: 1 
  })),

  clearFilters: () => set({
    filters: {
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      sort: 'newest',
      search: '',
    },
    page: 1
  }),

  setPage: (page) => set({ page }),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters, page } = get();
      const limit = 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('products')
        .select('*, categories(*)', { count: 'exact' });

      // Apply Filters
      if (filters.category) {
        // Find category ID first if needed, but categories are joined
        query = query.filter('categories.slug', 'eq', filters.category);
      }
      if (filters.minPrice) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
      if (filters.search) query = query.ilike('name', `%${filters.search}%`);
      if (filters.size) query = query.contains('sizes', [filters.size]);

      // Sorting
      if (filters.sort === 'newest') query = query.order('created_at', { ascending: false });
      else if (filters.sort === 'price_asc') query = query.order('price', { ascending: true });
      else if (filters.sort === 'price_desc') query = query.order('price', { ascending: false });

      // Pagination
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      set({
        products: data.map(mapProduct),
        total: count || 0,
        page,
        pages: Math.ceil((count || 0) / limit),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, error: null, product: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('slug', slug)
        .single();
        
      if (error) throw error;
      set({ product: mapProduct(data), isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      set({ categories: data.map(c => ({ ...c, _id: c.id })) });
    } catch (error) {
      console.error('Failed to load categories from Supabase', error);
    }
  },
}));
