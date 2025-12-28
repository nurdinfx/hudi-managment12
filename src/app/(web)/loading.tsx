import SoftLoader from '@/components/SoftLoader/SoftLoader';

const LoadingSpinner = () => (
  <SoftLoader 
    size="large" 
    color="primary"
    text="Loading your experience"
    fullScreen={true}
    overlay={false}
  />
);

export default LoadingSpinner;
