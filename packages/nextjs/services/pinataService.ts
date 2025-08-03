/**
 * Pinata IPFS Service for Real Estate NFT Metadata
 * Handles uploading property metadata and images to IPFS via Pinata
 */

interface PropertyMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
  properties: {
    address: string;
    valuation: number;
    bedrooms?: number;
    bathrooms?: number;
    squareMeters?: number;
    yearBuilt?: number;
    propertyType: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface PinataConfig {
  pinataApiKey: string;
  pinataSecretApiKey: string;
  pinataGateway: string;
}

class PinataService {
  private config: PinataConfig;

  constructor(config: PinataConfig) {
    this.config = config;
  }

  /**
   * Upload image to Pinata IPFS
   */
  async uploadImage(imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", imageFile);

    const metadata = JSON.stringify({
      name: `property-image-${Date.now()}`,
      keyvalues: {
        type: "property-image",
        timestamp: Date.now().toString(),
      },
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: this.config.pinataApiKey,
          pinata_secret_api_key: this.config.pinataSecretApiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return `https://${this.config.pinataGateway}/ipfs/${result.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading image to Pinata:", error);
      throw error;
    }
  }

  /**
   * Upload metadata JSON to Pinata IPFS
   */
  async uploadMetadata(metadata: PropertyMetadata): Promise<string> {
    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: this.config.pinataApiKey,
          pinata_secret_api_key: this.config.pinataSecretApiKey,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `property-metadata-${metadata.properties.address.replace(/\s+/g, "-")}`,
            keyvalues: {
              type: "property-metadata",
              address: metadata.properties.address,
              valuation: metadata.properties.valuation.toString(),
              timestamp: Date.now().toString(),
            },
          },
          pinataOptions: {
            cidVersion: 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Pinata metadata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return `https://${this.config.pinataGateway}/ipfs/${result.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading metadata to Pinata:", error);
      throw error;
    }
  }

  /**
   * Create complete property metadata and upload to IPFS
   */
  async createPropertyNFT(
    propertyData: {
      name: string;
      description: string;
      address: string;
      valuation: number;
      bedrooms?: number;
      bathrooms?: number;
      squareMeters?: number;
      yearBuilt?: number;
      propertyType: string;
      city: string;
      country: string;
      coordinates?: { lat: number; lng: number };
    },
    imageFile?: File,
  ): Promise<{ metadataURI: string; imageURI?: string }> {
    let imageURI: string | undefined;

    // Upload image if provided
    if (imageFile) {
      imageURI = await this.uploadImage(imageFile);
    }

    // Create metadata
    const metadata: PropertyMetadata = {
      name: propertyData.name,
      description: propertyData.description,
      image:
        imageURI || `https://via.placeholder.com/600x400/4f46e5/ffffff?text=${encodeURIComponent(propertyData.name)}`,
      external_url: `https://maps.google.com/?q=${encodeURIComponent(propertyData.address)}`,
      attributes: [
        {
          trait_type: "Property Type",
          value: propertyData.propertyType,
        },
        {
          trait_type: "City",
          value: propertyData.city,
        },
        {
          trait_type: "Country",
          value: propertyData.country,
        },
        {
          trait_type: "Valuation (USDT)",
          value: propertyData.valuation,
        },
        ...(propertyData.bedrooms ? [{ trait_type: "Bedrooms", value: propertyData.bedrooms }] : []),
        ...(propertyData.bathrooms ? [{ trait_type: "Bathrooms", value: propertyData.bathrooms }] : []),
        ...(propertyData.squareMeters ? [{ trait_type: "Square Meters", value: propertyData.squareMeters }] : []),
        ...(propertyData.yearBuilt ? [{ trait_type: "Year Built", value: propertyData.yearBuilt }] : []),
      ],
      properties: {
        address: propertyData.address,
        valuation: propertyData.valuation,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        squareMeters: propertyData.squareMeters,
        yearBuilt: propertyData.yearBuilt,
        propertyType: propertyData.propertyType,
        city: propertyData.city,
        country: propertyData.country,
        coordinates: propertyData.coordinates,
      },
    };

    // Upload metadata
    const metadataURI = await this.uploadMetadata(metadata);

    return {
      metadataURI,
      imageURI,
    };
  }

  /**
   * Retrieve metadata from IPFS
   */
  async getMetadata(ipfsHash: string): Promise<PropertyMetadata> {
    try {
      const response = await fetch(`https://${this.config.pinataGateway}/ipfs/${ipfsHash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching metadata from IPFS:", error);
      throw error;
    }
  }
}

// Default configuration for your Pinata instance
export const createPinataService = (apiKey?: string, secretKey?: string) => {
  return new PinataService({
    pinataApiKey: apiKey || process.env.NEXT_PUBLIC_PINATA_API_KEY || "",
    pinataSecretApiKey: secretKey || process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || "",
    pinataGateway: "beige-electoral-sawfish-43.mypinata.cloud",
  });
};

export { PinataService, type PropertyMetadata, type PinataConfig };

// Example usage:
/*
const pinataService = createPinataService();

const propertyData = {
  name: "Beautiful Family House",
  description: "A stunning 3-bedroom family house in downtown area",
  address: "123 Main Street, Downtown",
  valuation: 250000,
  bedrooms: 3,
  bathrooms: 2,
  squareMeters: 150,
  yearBuilt: 2010,
  propertyType: "House",
  city: "New York",
  country: "USA"
};

const { metadataURI, imageURI } = await pinataService.createPropertyNFT(propertyData, imageFile);
console.log("Metadata URI:", metadataURI);
*/
