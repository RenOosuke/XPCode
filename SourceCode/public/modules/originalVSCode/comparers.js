
{
    let Lazy = VSCode.original.Lazy;
    let sep = VSCode.original.sep;

    const intlFileNameCollatorBaseNumeric = new Lazy(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        return {
            collator,
            collatorIsNumeric: collator.resolvedOptions().numeric
        };
    });
    
    // A collator with numeric sorting enabled.
    const intlFileNameCollatorNumeric = new Lazy(() => {
        const collator = new Intl.Collator(undefined, { numeric: true });
        return {
            collator
        };
    });
    
    // A collator with numeric sorting enabled, and sensitivity to accents and diacritics but not case.
    const intlFileNameCollatorNumericCaseInsensitive = new Lazy(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'accent' });
        return {
            collator
        };
    });
    
    /** Compares filenames without distinguishing the name from the extension. Disambiguates by unicode comparison. */
    function compareFileNames(one, other, caseSensitive = false) {
        const a = one || '';
        const b = other || '';
        const result = intlFileNameCollatorBaseNumeric.value.collator.compare(a, b);
    
        // Using the numeric option will make compare(`foo1`, `foo01`) === 0. Disambiguate.
        if (intlFileNameCollatorBaseNumeric.value.collatorIsNumeric && result === 0 && a !== b) {
            return a < b ? -1 : 1;
        }
    
        return result;
    }
    
    /** Compares full filenames without grouping by case. */
    function compareFileNamesDefault(one, other) {
        const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
        one = one || '';
        other = other || '';
    
        return compareAndDisambiguateByLength(collatorNumeric, one, other);
    }
    
    /** Compares full filenames grouping uppercase names before lowercase. */
    function compareFileNamesUpper(one, other) {
        const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
        one = one || '';
        other = other || '';
    
        return compareCaseUpperFirst(one, other) || compareAndDisambiguateByLength(collatorNumeric, one, other);
    }
    
    /** Compares full filenames grouping lowercase names before uppercase. */
    function compareFileNamesLower(one, other) {
        const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
        one = one || '';
        other = other || '';
    
        return compareCaseLowerFirst(one, other) || compareAndDisambiguateByLength(collatorNumeric, one, other);
    }
    
    /** Compares full filenames by unicode value. */
    function compareFileNamesUnicode(one, other) {
        one = one || '';
        other = other || '';
    
        if (one === other) {
            return 0;
        }
    
        return one < other ? -1 : 1;
    }
    
    /** Compares filenames by extension, then by name. Disambiguates by unicode comparison. */
    function compareFileExtensions(one, other) {
        const [oneName, oneExtension] = extractNameAndExtension(one);
        const [otherName, otherExtension] = extractNameAndExtension(other);
    
        let result = intlFileNameCollatorBaseNumeric.value.collator.compare(oneExtension, otherExtension);
    
        if (result === 0) {
            // Using the numeric option will  make compare(`foo1`, `foo01`) === 0. Disambiguate.
            if (intlFileNameCollatorBaseNumeric.value.collatorIsNumeric && oneExtension !== otherExtension) {
                return oneExtension < otherExtension ? -1 : 1;
            }
    
            // Extensions are equal, compare filenames
            result = intlFileNameCollatorBaseNumeric.value.collator.compare(oneName, otherName);
    
            if (intlFileNameCollatorBaseNumeric.value.collatorIsNumeric && result === 0 && oneName !== otherName) {
                return oneName < otherName ? -1 : 1;
            }
        }
    
        return result;
    }
    
    /** Compares filenames by extension, then by full filename. Mixes uppercase and lowercase names together. */
    function compareFileExtensionsDefault(one, other) {
        one = one || '';
        other = other || '';
        const oneExtension = extractExtension(one);
        const otherExtension = extractExtension(other);
        const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
        const collatorNumericCaseInsensitive = intlFileNameCollatorNumericCaseInsensitive.value.collator;
    
        return compareAndDisambiguateByLength(collatorNumericCaseInsensitive, oneExtension, otherExtension) ||
            compareAndDisambiguateByLength(collatorNumeric, one, other);
    }
    
    /** Compares filenames by extension, then case, then full filename. Groups uppercase names before lowercase. */
    function compareFileExtensionsUpper(one, other) {
        one = one || '';
        other = other || '';
        const oneExtension = extractExtension(one);
        const otherExtension = extractExtension(other);
        const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
        const collatorNumericCaseInsensitive = intlFileNameCollatorNumericCaseInsensitive.value.collator;
    
        return compareAndDisambiguateByLength(collatorNumericCaseInsensitive, oneExtension, otherExtension) ||
            compareCaseUpperFirst(one, other) ||
            compareAndDisambiguateByLength(collatorNumeric, one, other);
    }
    
    /** Compares filenames by extension, then case, then full filename. Groups lowercase names before uppercase. */
    function compareFileExtensionsLower(one, other) {
        one = one || '';
        other = other || '';
        const oneExtension = extractExtension(one);
        const otherExtension = extractExtension(other);
        const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
        const collatorNumericCaseInsensitive = intlFileNameCollatorNumericCaseInsensitive.value.collator;
    
        return compareAndDisambiguateByLength(collatorNumericCaseInsensitive, oneExtension, otherExtension) ||
            compareCaseLowerFirst(one, other) ||
            compareAndDisambiguateByLength(collatorNumeric, one, other);
    }
    
    /** Compares filenames by case-insensitive extension unicode value, then by full filename unicode value. */
    function compareFileExtensionsUnicode(one, other) {
        one = one || '';
        other = other || '';
        const oneExtension = extractExtension(one).toLowerCase();
        const otherExtension = extractExtension(other).toLowerCase();
    
        // Check for extension differences
        if (oneExtension !== otherExtension) {
            return oneExtension < otherExtension ? -1 : 1;
        }
    
        // Check for full filename differences.
        if (one !== other) {
            return one < other ? -1 : 1;
        }
    
        return 0;
    }
    
    const FileNameMatch = /^(.*?)(\.([^.]*))?$/;
    
    /** Extracts the name and extension from a full filename, with optional special handling for dotfiles */
    function extractNameAndExtension(str, dotfilesAsNames = false) {
        const match = str ? FileNameMatch.exec(str) : [];
      
        let result = [(match && match[1]) || '', (match && match[3]) || ''];
      
        // if the dotfilesAsNames option is selected, treat an empty filename with an extension
        // or a filename that starts with a dot, as a dotfile name
        if (dotfilesAsNames && ((!result[0] && result[1]) || (result[0] && result[0].charAt(0) === '.'))) {
          result = [result[0] + '.' + result[1], ''];
        }
      
        return result;
      }
    
    /** Extracts the extension from a full filename. Treats dotfiles as names, not extensions. */
    function extractExtension(str) {
        const match = str ? FileNameMatch.exec(str) : [];
    
        return (match && match[1] && match[1].charAt(0) !== '.' && match[3]) || '';
    }
    
    function compareAndDisambiguateByLength(collator, one, other) {
        // Check for differences
        const result = collator.compare(one, other);
        if (result !== 0) {
            return result;
        }
    
        // In a numeric comparison, `foo1` and `foo01` will compare as equivalent.
        // Disambiguate by sorting the shorter string first.
        if (one.length !== other.length) {
            return one.length < other.length ? -1 : 1;
        }
    
        return 0;
    }
    
    /** @returns `true` if the string is starts with a lowercase letter. Otherwise, `false`. */
    function startsWithLower(string) {
        const character = string.charAt(0);
    
        return (character.toLocaleUpperCase() !== character) ? true : false;
    }
    
    /** @returns `true` if the string starts with an uppercase letter. Otherwise, `false`. */
    function startsWithUpper(string) {
        const character = string.charAt(0);
    
        return (character.toLocaleLowerCase() !== character) ? true : false;
    }
    
    /**
     * Compares the case of the provided strings - lowercase before uppercase
     *
     * @returns
     * ```text
     *   -1 if one is lowercase and other is uppercase
     *    1 if one is uppercase and other is lowercase
     *    0 otherwise
     * ```
     */
    function compareCaseLowerFirst(one, other) {
        if (startsWithLower(one) && startsWithUpper(other)) {
            return -1;
        }
        return (startsWithUpper(one) && startsWithLower(other)) ? 1 : 0;
    }
    
    /**
     * Compares the case of the provided strings - uppercase before lowercase
     *
     * @returns
     * ```text
     *   -1 if one is uppercase and other is lowercase
     *    1 if one is lowercase and other is uppercase
     *    0 otherwise
     * ```
     */
    function compareCaseUpperFirst(one, other) {
        if (startsWithUpper(one) && startsWithLower(other)) {
            return -1;
        }
        return (startsWithLower(one) && startsWithUpper(other)) ? 1 : 0;
    }
    
    function comparePathComponents(one, other, caseSensitive = false) {
        if (!caseSensitive) {
            one = one && one.toLowerCase();
            other = other && other.toLowerCase();
        }
    
        if (one === other) {
            return 0;
        }
    
        return one < other ? -1 : 1;
    }
    
    function comparePaths(one, other, caseSensitive = false) {
        const oneParts = one.split(sep);
        const otherParts = other.split(sep);
    
        const lastOne = oneParts.length - 1;
        const lastOther = otherParts.length - 1;
        let endOne, endOther;
    
        for (let i = 0; ; i++) {
            endOne = lastOne === i;
            endOther = lastOther === i;
    
            if (endOne && endOther) {
                return compareFileNames(oneParts[i], otherParts[i], caseSensitive);
            } else if (endOne) {
                return -1;
            } else if (endOther) {
                return 1;
            }
    
            const result = comparePathComponents(oneParts[i], otherParts[i], caseSensitive);
    
            if (result !== 0) {
                return result;
            }
        }
    }
    
    function compareAnything(one, other, lookFor) {
        const elementAName = one.toLowerCase();
        const elementBName = other.toLowerCase();
    
        // Sort prefix matches over non prefix matches
        const prefixCompare = compareByPrefix(one, other, lookFor);
        if (prefixCompare) {
            return prefixCompare;
        }
    
        // Sort suffix matches over non suffix matches
        const elementASuffixMatch = elementAName.endsWith(lookFor);
        const elementBSuffixMatch = elementBName.endsWith(lookFor);
        if (elementASuffixMatch !== elementBSuffixMatch) {
            return elementASuffixMatch ? -1 : 1;
        }
    
        // Understand file names
        const r = compareFileNames(elementAName, elementBName);
        if (r !== 0) {
            return r;
        }
    
        // Compare by name
        return elementAName.localeCompare(elementBName);
    }
    
     function compareByPrefix(one, other, lookFor) {
        const elementAName = one.toLowerCase();
        const elementBName = other.toLowerCase();
    
        // Sort prefix matches over non prefix matches
        const elementAPrefixMatch = elementAName.startsWith(lookFor);
        const elementBPrefixMatch = elementBName.startsWith(lookFor);
        if (elementAPrefixMatch !== elementBPrefixMatch) {
            return elementAPrefixMatch ? -1 : 1;
        }
    
        // Same prefix: Sort shorter matches to the top to have those on top that match more precisely
        else if (elementAPrefixMatch && elementBPrefixMatch) {
            if (elementAName.length < elementBName.length) {
                return -1;
            }
    
            if (elementAName.length > elementBName.length) {
                return 1;
            }
        }
    
        return 0;
    }



    // [
    //     'compareFileNames',
    //     'compareFileNamesDefault',
    //     'compareFileNamesUpper',
    //     'compareFileNamesLower',
    //     'compareFileNamesUnicode',
    //     'compareFileExtensions',
    //     'compareFileExtensionsDefault',
    //     'compareFileExtensionsUpper',
    //     'compareFileExtensionsLower',
    //     'compareFileExtensionsUnicode',
    //     'comparePaths',
    //     'compareAnything',
    //     'compareByPrefix',
    // ].map(func => {
    //     eval(`
    //         VSCode.original.comparer['${func}'] = ${func};
    //     `);
    // })

    class FileSorter {

        constructor(explorerService, contextService) {
          this.explorerService = explorerService;
          this.contextService = contextService;

          this.compare = this.compare.bind(this);
        }
      
        compare(statA, statB) {
          // Do not sort roots
          if (statA.isRoot) {
            if (statB.isRoot) {
              const workspaceA = this.contextService.getWorkspaceFolder(statA.resource);
              const workspaceB = this.contextService.getWorkspaceFolder(statB.resource);
              return workspaceA && workspaceB ? (workspaceA.index - workspaceB.index) : -1;
            }
            return -1;
          }
      
          if (statB.isRoot) {
            return 1;
          }
      
          const { sortOrder, lexicographicOptions, reverse } = this.explorerService.sortOrderConfiguration;
          
          if (reverse) {
            [statA, statB] = [statB, statA];
          }
      
          let compareFileNames;
          let compareFileExtensions;
      
          switch (lexicographicOptions) {
            case 'upper':
              compareFileNames = compareFileNamesUpper;
              compareFileExtensions = compareFileExtensionsUpper;
              break;
            case 'lower':
              compareFileNames = compareFileNamesLower;
              compareFileExtensions = compareFileExtensionsLower;
              break;
            case 'unicode':
              compareFileNames = compareFileNamesUnicode;
              compareFileExtensions = compareFileExtensionsUnicode;
              break;
            default:
              compareFileNames = compareFileNamesDefault;
              compareFileExtensions = compareFileExtensionsDefault;
          }
      
          // Sort Directories
          switch (sortOrder) {
            case 'type':
              if (statA.isFolder && !statB.isFolder) {
                return -1;
              }
              if (statB.isFolder && !statA.isFolder) {
                return 1;
              }
              if (statA.isFolder && statB.isFolder) {
                return compareFileNames(statA.name, statB.name);
              }
              break;
      
            case 'filesFirst':
              if (statA.isFolder && !statB.isFolder) {
                return 1;
              }
              if (statB.isFolder && !statA.isFolder) {
                return -1;
              }
              break;
      
            case 'foldersNestsFiles':
              if (statA.isFolder && !statB.isFolder) {
                return -1;
              }
              if (statB.isFolder && !statA.isFolder) {
                return 1;
              }
              if ((statA.children || []).length > 0 && !((statB.children || []).length > 0)) {
                return -1;
              }
              if ((statB.children || []).length > 0 && !((statA.children || []).length > 0)) {
                return 1;
              }
              break;
      
            case 'mixed':
              break; // not sorting when "mixed" is on
      
            default: /* 'default', 'modified' */
              if (statA.isFolder && !statB.isFolder) {
                return -1;
              }
              if (statB.isFolder && !statA.isFolder) {
                return 1;
              }
              break;
          }
      
          // Sort Files
          switch (sortOrder) {
            case 'type':
              return compareFileExtensions(statA.name, statB.name);
      
            case 'modified':
              if (statA.mtime !== statB.mtime) {
                return (statA.mtime && statB.mtime && statA.mtime < statB.mtime) ? 1 : -1;
              }
              return compareFileNames(statA.name, statB.name);
      
            default: /* 'default', 'mixed', 'filesFirst' */
              return compareFileNames(statA.name, statB.name);
          }
        }
    } 

    const explorerService = {
      sortOrderConfiguration: {
        sortOrder: 'default',
        lexicographicOptions: 'default',
        reverse: false
      }
    };
    
    const contextService = {
      getWorkspaceFolder: (resource) => ({ index: 0 }) // Mock implementation
    };

    let sorter = new FileSorter(explorerService, contextService);

    VSCode.original.comparer = sorter;

    let timeB = new Date().getTime();
    console.log((timeB - timeA) / 1000)
}