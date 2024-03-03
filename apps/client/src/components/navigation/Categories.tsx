import { useLocation } from 'react-router-dom';

import Container from '../Container';
import CategoryBox from './CategoryBox';
import categories from '../../categories';

export default function Categories() {
  const location = useLocation();
  const params = new URLSearchParams(window.location.search);

  if(location.pathname !== '/') return null;
  
  return (
    <Container>
      <div className="flex items-center justify-between pt-4 overflow-x-auto">
        {categories.map(item => (
          <CategoryBox 
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={item.label === params.get('category')}
          />
        ))}
      </div>
    </Container>
  );
}
