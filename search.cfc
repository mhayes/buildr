<cfcomponent>
	<cffunction name="search_pesticides" access="remote" returnformat="json">
		<cfargument name="term" required="yes" />
		<cfreturn build_query(
			ARGUMENTS.term, 
			"WELLINV.WICHEM", 
			"NEW_CHEMCODE", 
			"CHNAME") />
	</cffunction>
	
	<cffunction name="search_counties" access="remote" returnformat="json">
		<cfargument name="term" required="yes" />
		<cfreturn build_query(
			ARGUMENTS.term, 
			"COUNTY", 
			"COUNTY_CD", 
			"COUNTY_NAME") />
	</cffunction>
	
	<cffunction name="build_query" access="private">
		<cfargument name="term">
		<cfargument name="tbl">
		<cfargument name="id">
		<cfargument name="value">
		
		<cfquery datasource="mark_ora_dev" name="records" maxRows="30">
		SELECT
			#arguments.id# as ID,
			#arguments.value# as VALUE
		FROM
			#arguments.tbl#
		WHERE
			UPPER(#arguments.value#) LIKE UPPER(<cfqueryparam value="%#arguments.term#%">)
		</cfquery>
		
		<cfset var recordArray = [] />
		<cfloop query="records">
			<!---<cfset ArrayAppend(recordArray, {value=records.id, label=records.value}) />--->
			<cfset ArrayAppend(recordArray, records.value) />
		</cfloop>
		
		<cfreturn recordArray />
	</cffunction>
</cfcomponent>