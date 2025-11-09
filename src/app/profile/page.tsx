import Layout from "@/components/Layout";
import { FaUserAlt } from "react-icons/fa";

const ProfilePage = () => {
  return (
    <Layout>
      <div className="pt-5 pl-28">
        <div className="flex gap-3 items-center">
          <FaUserAlt className="text-5xl bg-[#019ee2] text-white p-2 rounded-md " />
          <h2 className="text-2xl font-bold ">Rezvi Rayhan</h2>
        </div>
        <div className="bg-white shadow-md w-11/12 mt-6 rounded-xl h-[530px] ">
          <div className="pt-16">
            <img
              src="https://adgm-portal-qa.xr-23.com/_next/image?url=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F036%2F594%2F092%2Fnon_2x%2Fman-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg&w=256&q=75"
              alt="description"
              className="rounded-full w-[13%] mx-auto "
            />
          </div>
          <div className="w-2/3 bg-[#d1d5db] mx-auto h-28 mt-4 rounded-xl">
            <div className="flex pl-12 pt-8">
              <div>
                <h2>Name</h2>
                <h2>Rezvi Rayhan</h2>
              </div>
              <div className="ml-96">
                <h2>Email</h2>
                <h2>reavirayhan2002@gmail.com</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
