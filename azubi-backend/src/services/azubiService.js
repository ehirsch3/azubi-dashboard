import { query } from "../db.js";

export const getAzubis = async () => {
  const queryText = `
      SELECT 
          p.firstname, 
          p.lastname, 
          m.apprentice, 
          m.id_person
      FROM 
          person p
      INNER JOIN 
          mpsworker m
      ON 
          p.id = m.id_person
      WHERE 
          p.active = true 
          AND m.id_person NOT IN (6640, 32, 360, 389, 397, 845, 1958, 1990, 3481, 5827, 6425, 6701, 6831, 6832, 7131, 7187, 7259, 7330, 7870, 8475, 8513, 8651, 9102)
  `;

  try {
    const result = await query(queryText);
    return result.rows; // Return the rows containing Azubi data
  } catch (error) {
    console.error("Error fetching Azubis:", error);
    throw error;
  }
};

export const createAzubis = async (id_person) => {
  const queryText = `
      UPDATE 
          mpsworker
      SET 
          apprentice = TRUE
      WHERE 
          id_person = $1
      RETURNING id_person, apprentice;
  `;

  try {
    const result = await query(queryText, [id_person]);
    return result.rows; // Return the updated row(s) with apprentice set to true
  } catch (error) {
    console.error("Error creating Azubi:", error);
    throw error;
  }
};

export const deleteAzubis = async (id_person) => {
  const queryText = `
      UPDATE 
          mpsworker
      SET 
          apprentice = FALSE
      WHERE 
          id_person = $1
      RETURNING id_person, apprentice;
  `;

  try {
    const result = await query(queryText, [id_person]);
    return result.rows; // Return the updated row(s) with apprentice set to false
  } catch (error) {
    console.error("Error deleting Azubi:", error);
    throw error;
  }
};

export const searchAzubis = async (searchTerm) => {
  const queryText = `
      SELECT 
          person.id AS id_person, 
          person.firstname, 
          person.lastname, 
          mpsworker.apprentice
      FROM 
          person
      INNER JOIN 
          mpsworker ON person.id = mpsworker.id_person
      WHERE 
          (person.firstname ILIKE $1 OR person.lastname ILIKE $1) 
          AND person.active = true
          AND mpsworker.id_person NOT IN (6640, 32, 360, 389, 397, 845, 1958, 1990, 3481, 5827, 6425, 6701, 6831, 6832, 7131, 7187, 7259, 7330, 7870, 8475, 8513, 8651, 9102);
  `;

  try {
    const result = await query(queryText, [`%${searchTerm}%`]);
    return result.rows; // Return the matching rows
  } catch (error) {
    console.error("Error searching Azubis:", error);
    throw error;
  }
};
