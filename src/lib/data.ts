/** dummy data to act has what chatgpt will generate with a prompt...this data and other information gets
 * stored in the DB when an endpoint is called by the extension. This page gets this data from
 * the DB by sending an event to the extension with the youtube name that was passed from the parameter string
 */

export const share_data = {
  general_topic: "Advanced Routing Techniques in Next.js",
  video_id: "12se45kd",
  video_name: "some name",
  video_thumbnail: [{ thumbnail_url: "" }],
  video_url: "some video url",
  category: "",
  slug: "",
  summary:
    "The video explains catch-all segments in Next.js routing, demonstrating how to use dynamic routing to manage numerous routes efficiently. By utilizing catch-all segments, a single file can handle multiple URL segments, simplifying the folder structure and maintenance. A practical setup and customization of catch-all segments are shown, including handling optional routes.",
  timestamp_summary: [
    { icon: "🚀", key_ideas: [], start_time: 0, tldr: "00:00 Introduction to catch-all segments." },
    {
      icon: "🛠️",
      key_ideas: [],
      start_time: 42.444,
      tldr: "00:10 Scenario: Building a documentation site with multiple features and concepts.",
    },
    {
      icon: "🔍",
      key_ideas: [],
      start_time: 52.023,
      tldr: "00:25 Potential complexity with 400 routes and files.",
    },
    {
      icon: "🛤️",
      key_ideas: [],
      start_time: 60.444,
      tldr: "00:40 Introduction of dynamic routing to manage routes efficiently.",
    },
    {
      icon: "📁",
      key_ideas: [],
      start_time: 42.444,
      tldr: "00:55 Using dynamic route folders to reduce the number of files.",
    },
    {
      icon: "📝",
      key_ideas: [],
      start_time: 42.444,
      tldr: "01:10 Creating a dynamic feature ID folder structure.",
    },
    {
      icon: "🎬",
      key_ideas: [],
      start_time: 42.444,
      tldr: "01:25 Demonstration of catch-all segments setup in Next.js.",
    },
    {
      icon: "📄",
      key_ideas: [],
      start_time: 42.444,
      tldr: "01:35 Creating a 'docs' folder with a special '[...slug]' folder.",
    },
    {
      icon: "⚙️",
      key_ideas: [],
      start_time: 42.444,
      tldr: "01:50 Adding a basic React component to handle catch-all segments.",
    },
    {
      icon: "🔍",
      key_ideas: [],
      start_time: 42.444,
      tldr: "02:00 Demonstration of the catch-all segments functionality in the browser.",
    },
    {
      icon: "💻",
      key_ideas: [],
      start_time: 42.444,
      tldr: "02:20 Accessing different segments in the URL using the params object.",
    },
    {
      icon: "🖌️",
      key_ideas: [],
      start_time: 42.444,
      tldr: "02:40 Customizing the UI logic based on route parameters.",
    },
    { icon: "🔄", key_ideas: [], start_time: 42.444, tldr: "03:00 Introduction to optional catch-all segments." },
    {
      icon: "🛑",
      key_ideas: [],
      start_time: 42.444,
      tldr: "03:15 Handling 404 errors with optional catch-all segments.",
    },
    {
      icon: "🔎",
      key_ideas: [],
      start_time: 42.444,
      tldr: "03:30 Demonstration and explanation of optional catch-all segments.",
    },
    {
      icon: "🔍",
      key_ideas: [],
      start_time: 42.444,
      tldr: "03:45 Visualization of catch-all segments and their application.",
    },
    { icon: "📝", key_ideas: [], start_time: 42.444, tldr: "04:00 Conclusion and preview of upcoming topics." },
  ],
  insights: {
    name: "Efficient Route Management",
    points: [
      {
        icon: "🔍",
        title: "Dynamic routing reduces the number of files needed in a project, improving folder structure.",
      },
      {
        icon: "🔧",
        title: "Catch-all segments in Next.js can handle multiple URL paths with a single file, simplifying route management.",
      },
      {
        icon: "🧠",
        title: "This feature allows for better organization and SEO by maintaining the same layout for different document variations.",
      },
      {
        icon: "🌐",
        title: "The ability to handle various URL segments with a single page enhances flexibility and maintainability in large applications.",
      },
    ],
  },
};

//this data is suppose to come from the DB
export const QandA_data = [
  {
    question: "What is the purpose of Neurolink?",
    answer: "Neurolink is an implanted device that can restore lost functionality in the brain, such as eyesight, hearing, and limb movement. It is recommended for achieving full AI symbiosis.",
  },
  {
    question: "What is the importance of proper hygiene during the pandemic?",
    answer: "Proper hygiene, such as washing hands and wearing masks when coughing, is essential to prevent the spread of the virus and protect those at risk.",
  },
];

export const default_data_structure = {
  comments: null,
  insights: null,
  isPartial: false,
  timestamp_summary: null,
  transcript: null,
  summary: null,
};
