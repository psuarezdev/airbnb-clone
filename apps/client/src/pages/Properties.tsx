import useAuth from '../hooks/useAuth';
import useProperties from '../hooks/useProperties';
import EmptyState from '../components/EmptyState';
import PropertiesList from '../components/properties/PropertiesList';
import Spinner from '../components/Spinner';

export default function Properties() {
  const profile = useAuth(state => state.profile);
  const { properties, removeProperty, isLoading} = useProperties();

  if(!profile) {
    return <EmptyState title="Unauthorized" subtitle="Please login to view your properties." />;
  }

  if(isLoading) return <Spinner />;
  
  if(!properties || properties.length === 0) {
    return <EmptyState title="No properties" subtitle="Looks like you no properties." />;
  }
  
  return (
    <PropertiesList
      properties={properties}
      removeProperty={removeProperty}
      profile={profile}
    />
  );
}
