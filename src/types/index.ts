export type SceneId = 0 | 1 | 2 | 3 | 4 | 5;

export interface ConstellationNode {
  id: number;
  label: string;
  statement: string;
  position: [number, number, number];
  color: string;
}

export interface PetalThought {
  id: string;
  theme: string;
  quote: string;
  reflection: string;
  color: string;
  initialAngle: number;
}

export interface ExperienceContent {
  recipient: {
    name: string;
    greeting: string;
    subGreeting: string;
  };
  eventDate: {
    display: string;
    description: string;
    themeQuote: string;
  };
  constellationThoughts: ConstellationNode[];
  letter: {
    greeting: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  unsaidPetals: PetalThought[];
  finale: {
    closingThoughts: string[];
    actionButtonText: string;
    postDriftMessage: string;
    postDriftSubtext: string;
  };
}
