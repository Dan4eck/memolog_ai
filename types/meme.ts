export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export interface ImgflipTemplatesResponse {
  success: boolean;
  data: {
    memes: Array<{
      id: string;
      name: string;
      url: string;
      width: number;
      height: number;
      box_count: number;
    }>;
  };
}

export interface GenerationRequest {
  templateId: string;
  topic: string;
}

export interface GeneratedMeme {
  id: string;
  imageUrl: string;
  caption: {
    top: string;
    bottom?: string;
  };
}

export interface GenerationResponse {
  success: boolean;
  memes: GeneratedMeme[];
  error?: string;
}
