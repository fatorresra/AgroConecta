import { useState, useEffect } from "react";
import { getUserById } from "../services/AuthService";

export const useFarmer = (farmerId) => {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmer = async () => {
      if (!farmerId) {
        console.log('No farmerId provided');
        return;
      }

      // console.log('Fetching farmer with ID:', farmerId);
      setLoading(true);
      setError(null);

      try {
        const response = await getUserById(farmerId);
        // console.log('Farmer response:', response);
        if (response.success) {
          setFarmer(response.farmer);
        } else {
          console.error('Error fetching farmer:', response.error);
          setError(response.error);
        }
      } catch (err) {
        console.error('Exception fetching farmer:', err);
        setError("Error al cargar información del agricultor");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [farmerId]);

  return { farmer, isLoading: loading, error };
};
