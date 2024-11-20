import Login from "@/components/Login";
import GoogleReCaptchaWrapper from "@/providers/GoogleCaptchaWrapper";

const Home = () => {

  return (
    <GoogleReCaptchaWrapper>
      <Login />
    </GoogleReCaptchaWrapper>

  );
};

export default Home;
