import UserProfile from '@/components/UserProfile';

export default function ProfilePage() {


  return (
    <div className="dashboard-page">
      <h1 className='text-3xl lg:text-4xl font-bold mb-6'>Edit Profile</h1>
      <UserProfile />
    </div>
  );
}
