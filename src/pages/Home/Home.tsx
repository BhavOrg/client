import Header from "../../components/common/Header/Header";
import MissionSection from "../../components/common/MissionSection/MissionSection";
import SupportTopicsSection from "../../components/common/SupportTopicsSection/SupportTopicsSection";
import QuoteSection from "../../components/common/QuoteSection/QuoteSection";
import ExpertsSection from "../../components/common/ExpertsSection/ExpertsSection";
import ExpertCategoriesSection from "../../components/common/ExpertCategoriesSection/ExpertCategoriesSection";
import Footer from "../../components/common/Footer/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <MissionSection />
        <SupportTopicsSection />
        <QuoteSection
          quote="You don't have to control your thoughts. You just have to stop letting them control you."
          author="Dan Millman"
          authorTitle="Author, Way of the Peaceful Warrior"
          imageSrc={""}
        />
        <ExpertsSection />
        <ExpertCategoriesSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
