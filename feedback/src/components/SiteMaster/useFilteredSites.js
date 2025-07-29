import { useMemo } from 'react';

export default function useFilteredSites(sites, searchTerm, filterCity, filterCategory, currentPage, itemsPerPage) {
  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      const matchesSearch = site.site_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = filterCity ? site.city?.toLowerCase() === filterCity.toLowerCase() : true;
      const matchesCategory = filterCategory ? site.category_id === filterCategory : true;
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [sites, searchTerm, filterCity, filterCategory]);

  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);
  const paginatedSites = useMemo(() => {
    return filteredSites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredSites, currentPage, itemsPerPage]);

  return { filteredSites, paginatedSites, totalPages };
}
