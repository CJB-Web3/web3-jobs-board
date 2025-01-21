const companies = [
  "avara",
  "brave",
  "celo",
  "centrifuge",
  "chainsafe-systems",
  "chorus-one",
  "coinshift",
  "consensys",
  "dappradar",
  "doodles",
];

function CompanySlider() {
  const companies1 = companies.map((company, index) => (
    <img
      key={index + company}
      src={`./companies/${company}.svg`}
      alt={`${company} logo`}
      className="flex-grow items-center justify-center w-28 md:w-32 px-5 py-2 dark:brightness-0 dark:invert dark:contrast-200 transition-all duration-200"
    />
  ));

  const companies2 = companies.map((company, index) => (
    <img
      key={index + 10 + company}
      src={`./companies/${company}.svg`}
      alt={`${company} logo`}
      className="flex-grow items-center justify-center w-28 md:w-32 px-5 py-2 dark:brightness-0 dark:invert dark:contrast-200"
    />
  ));

  return (
    <div className="w-full bg-secondary/10 dark:bg-secondary/10 py-6">
      <div className="w-full lg:max-w-7xl mx-auto overflow-hidden">
        <div className="flex h-20 lg:h-28 w-full animate-company whitespace-nowrap">
          {companies1}
          {companies2}
        </div>
      </div>
    </div>
  );
}

export default CompanySlider;
