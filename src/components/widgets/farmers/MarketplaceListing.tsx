import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { ShoppingCart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const MarketplaceListing: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: 2500,
      unit: 'per basket',
      stock: 45,
      trend: 'up',
      change: 12
    },
    {
      id: 2,
      name: 'Organic Maize',
      price: 15000,
      unit: 'per bag (50kg)',
      stock: 120,
      trend: 'down',
      change: 5
    },
    {
      id: 3,
      name: 'Sweet Yam',
      price: 8000,
      unit: 'per tuber',
      stock: 30,
      trend: 'up',
      change: 8
    },
    {
      id: 4,
      name: 'Cassava Flour',
      price: 12000,
      unit: 'per bag (25kg)',
      stock: 80,
      trend: 'up',
      change: 15
    },
  ];

  return (
    <WidgetContainer
      title="Marketplace"
      icon={ShoppingCart}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          List Product
        </button>
      }
    >
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-lg font-bold text-afro-green">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {product.unit}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Stock: <strong className="text-gray-900 dark:text-white">{product.stock} units</strong>
                  </span>
                  <div className={`flex items-center gap-1 ${
                    product.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {product.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="font-medium">{product.change}%</span>
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 text-sm bg-afro-green/10 text-afro-green hover:bg-afro-green hover:text-white rounded-lg transition-colors">
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-green-600 dark:text-green-500 mb-1">This Week</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-400">₦285K</p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-500 mb-1">Total Sales</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-400">₦1.2M</p>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default MarketplaceListing;