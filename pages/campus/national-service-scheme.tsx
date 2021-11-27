import { NextPage } from "next";
import InstagramHeader from "../../components/custom/InstagramHeader";
import LargeUserCardWithDetails from "../../components/custom/LargeUserCardWithDetails";
import RibbonCard from "../../components/custom/RibbonCard";
import UserProfileCard from "../../components/custom/UserProfileCard";
import Container from "../../components/layout/Container";
import Content from "../../components/layout/Content";
import Page from "../../components/layout/Page";
import { PageTitle } from "../../components/layout/PageTitle";
import EventCarousel from "../../components/ui/EventCarousal";
import { usersDb, UserType } from "../../server/db";
import { getOther } from "../../server/other";

interface PageType {
  programOfficer: ProgramOfficer;
  misssion: string;
  about: string;
  volenteerSecreteries_ids: string[];
  vss: UserType[];
}

interface ProgramOfficer {
  avatar: string;
  fullName: string;
  designation: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: { [key: string]: string };
}

const CustomPage: NextPage<{ page: PageType }> = ({ page }) => {
  return(

  <Page title="National Service Scheme (NSS)">
    <Container>
      <PageTitle>National Service Scheme</PageTitle>
      <Content>
        <Content.Left>
          <div className="mr-2">
            <LargeUserCardWithDetails
              subTitle={"Program Officer, NSS"}
              {...page.programOfficer}
            />
          </div>
        </Content.Left>
        <Content.Right>
          <RibbonCard color="red">
            <h2 className="mb-2 text-2xl font-bold text-gray-100">Mission</h2>
            <p className="text-gray-100">{page.misssion}</p>
            <h2 className="mb-2 text-2xl font-bold text-gray-100">Motto</h2>
            <p className="text-gray-100">Not me but You!</p>
          </RibbonCard>
        </Content.Right>
      </Content>
      <Content>
        <Content.FullWidth>
          <PageTitle>About NSS</PageTitle>
          <div className="my-3">
            <p>{page.about}</p>
          </div>
        </Content.FullWidth>
      </Content>
      <Content>
        <Content.FullWidth>
          <PageTitle>NSS on Instagram </PageTitle>
          <div className="mx-2 border-2 border-pink-700 rounded-lg">
            <InstagramHeader />
          </div>
        </Content.FullWidth>
      </Content>
      <Content>
        <Content.FullWidth>
          <PageTitle>Previous Events</PageTitle>
          <div className="my-3">
            <EventCarousel />
          </div>
        </Content.FullWidth>
      </Content>
      <Content>
        <Content.Left>
          <PageTitle>Volunteer secretaries</PageTitle>
          <div className="grid grid-cols-2 gap-4 my-3 lg:grid-cols-2 2xl:grid-cols-3">
            {page.vss.map((vs) => (
              <UserProfileCard
              {...vs}
                key={vs.name}
              />
            ))}
          </div>
        </Content.Left>
      </Content>
    </Container>
  </Page>
)};

export default CustomPage;

export async function getStaticProps() {
  
  const page = (await getOther("page-national-service-scheme")) as PageType;
  let unresolvedpromises: any;
  let staffs: UserType[] = [];
  unresolvedpromises = page.volenteerSecreteries_ids?.map(async (element) => {
    const staff = (await usersDb.get(element)) as unknown as UserType | null;
    if (staff) {
      staffs.push(staff);
    }
    return staff;
  });
  if (unresolvedpromises) await Promise.all(unresolvedpromises);
  return {
    props: {
      page: { ...page, vss: staffs },
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 600000, // In seconds
  };
}
