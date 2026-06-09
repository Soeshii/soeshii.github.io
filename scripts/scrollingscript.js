document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("#navbar a");
  
  // Extract target IDs directly from the navbar links
  const targetIds = Array.from(navLinks)
    .map(link => link.getAttribute("href"))
    .filter(href => href.startsWith('#'))
    .map(href => href.substring(1));

  // Select the elements present in the DOM
  const sections = document.querySelectorAll(targetIds.map(id => `#${id}`).join(', '));

  const observerOptions = {
    root: null,
    rootMargin: "-30% 0px -60% 0px", // Triggers when section occupies upper-middle viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute("id");
        
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});     