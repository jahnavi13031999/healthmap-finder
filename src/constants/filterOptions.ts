export const FILTER_OPTIONS = {
  location: [
    { value: 'all', label: 'All Locations' },
    { value: 'city', label: 'Within City Only' },
    { value: 'state', label: 'Within State' },
  ],
  performance: [
    { value: 'all', label: 'All Ratings' },
    { value: 'excellent', label: '⭐⭐⭐⭐⭐ Excellent' },
    { value: 'good', label: '⭐⭐⭐⭐ Good' },
    { value: 'average', label: '⭐⭐⭐ Average' },
    { value: 'below', label: '⭐⭐ Below Average' },
    { value: 'poor', label: '⭐ Poor' },
  ],
  sortBy: [
    { value: 'rating', label: 'Best Rating First' },
    { value: 'distance', label: 'Closest First' },
    { value: 'name', label: 'Hospital Name' },
  ]
};