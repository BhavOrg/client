// Import the Bhav logo
import bhav_logo from "../../../assets/icons/bhav_logo.svg";

// Navigation item interface
export interface NavItem {
  name: string;
  link?: string;
  description?: string;
  dropdown?: NavDropdownCategory[];
  action?: string;
}

// Dropdown category interface
export interface NavDropdownCategory {
  name: string;
  subDropdown?: NavSubDropdownItem[];
}

// Sub-dropdown item interface
export interface NavSubDropdownItem {
  name: string;
  link: string;
}

// Navigation config interface
export interface NavConfig {
  logo: {
    src: string;
    alt: string;
    link: string;
  };
  menu: NavItem[];
  authActions: {
    loggedIn: NavItem[];
    loggedOut: NavItem[];
  };
}

// Navigation configuration
const navConfig: NavConfig = {
  logo: {
    src: bhav_logo,
    alt: "Bhav Logo",
    link: "/",
  },
  menu: [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Feed",
      link: "/feed",
      description:
        "View and interact with posts from the community. Users can create posts, like, comment, and share.",
    },
    {
      name: "Community",
      link: "/community",
      description:
        "Join topic-based groups and connect with like-minded individuals.",
    },
    {
      name: "Blogs",
      link: "/blogs",
      description:
        "Explore articles and resources on mental health and wellness.",
    },
    {
      name: "Services",
      dropdown: [
        {
          name: "Get Help For",
          subDropdown: [
            {
              name: "Anxiety",
              link: "/help/anxiety",
            },
            {
              name: "Stress",
              link: "/help/stress",
            },
            {
              name: "...More Issues",
              link: "/help/issues",
            },
          ],
        },
        {
          name: "Therapy for Mental Wellness",
          subDropdown: [
            {
              name: "Marriage Counseling",
              link: "/therapy/marriage-counseling",
            },
            {
              name: "Relationship Counseling",
              link: "/therapy/relationship-counseling",
            },
            {
              name: "...More Therapies",
              link: "/therapy/therapies",
            },
          ],
        },
      ],
    },
    {
      name: "Contact",
      link: "/contact",
      description: "Reach out to us for any queries or support.",
    },
  ],
  authActions: {
    loggedIn: [
      {
        name: "Profile",
        link: "/profile",
      },
      {
        name: "Logout",
        action: "/logout",
      },
    ],
    loggedOut: [
      {
        name: "Login",
        link: "/login",
      },
      {
        name: "Register",
        link: "/register",
      },
    ],
  },
};

export default navConfig;
